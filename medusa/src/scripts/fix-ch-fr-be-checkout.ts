import {
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateRegionsWorkflow,
  updateStoresWorkflow,
} from '@medusajs/medusa/core-flows';
import {
  ExecArgs,
  IFulfillmentModuleService,
  IInventoryService,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStockLocationService,
  IStoreModuleService,
  ITaxModuleService,
} from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';

type QueryGraphResultRow = {
  variant_id: string;
  inventory_item_id: string;
};

type QueryService = {
  graph: (
    input: {
      entity: string;
      fields: string[];
      filters?: Record<string, unknown>;
    },
    config?: Record<string, unknown>,
  ) => Promise<{ data: QueryGraphResultRow[] }>;
};

export default async function fixChFrBeCheckout({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const remoteLink = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as QueryService;

  const regionModuleService: IRegionModuleService = container.resolve(Modules.REGION);
  const taxModuleService: ITaxModuleService = container.resolve(Modules.TAX);
  const storeModuleService: IStoreModuleService = container.resolve(Modules.STORE);
  const salesChannelModuleService: ISalesChannelModuleService = container.resolve(
    Modules.SALES_CHANNEL,
  );
  const fulfillmentModuleService: IFulfillmentModuleService = container.resolve(
    Modules.FULFILLMENT,
  );
  const stockLocationService: IStockLocationService = container.resolve(
    Modules.STOCK_LOCATION,
  );
  const productModuleService: IProductModuleService = container.resolve(Modules.PRODUCT);
  const inventoryService: IInventoryService = container.resolve(Modules.INVENTORY);

  const countries = ['ch', 'fr', 'be'];
  const paymentProviderId = 'pp_stripe_stripe';
  const taxProviderId = 'tp_system';

  logger.info('Fixing default sales channel...');
  let defaultSalesChannels = await salesChannelModuleService.listSalesChannels({
    name: 'Default Sales Channel',
  });
  if (!defaultSalesChannels.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: 'Default Sales Channel' }],
      },
    });
    defaultSalesChannels = result;
  }
  const defaultSalesChannel = defaultSalesChannels[0];

  logger.info('Fixing region CH/FR/BE...');
  const [store] = await storeModuleService.listStores();
  const [existingRegion] = await regionModuleService.listRegions(
    { id: store.default_region_id || undefined },
    { take: 1 },
  );

  let regionId = existingRegion?.id;
  if (regionId) {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: regionId },
        update: {
          name: 'Europe',
          currency_code: 'eur',
          countries,
          payment_providers: [paymentProviderId],
          automatic_taxes: true,
        },
      },
    });
  } else {
    const [regionByName] = await regionModuleService.listRegions(
      { name: 'Europe' },
      { take: 1 },
    );
    if (regionByName) {
      regionId = regionByName.id;
      await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: regionId },
          update: {
            currency_code: 'eur',
            countries,
            payment_providers: [paymentProviderId],
            automatic_taxes: true,
          },
        },
      });
    } else {
      const { result } = await createRegionsWorkflow(container).run({
        input: {
          regions: [
            {
              name: 'Europe',
              currency_code: 'eur',
              countries,
              payment_providers: [paymentProviderId],
              automatic_taxes: true,
            },
          ],
        },
      });
      regionId = result[0].id;
    }
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_region_id: regionId,
        default_sales_channel_id: defaultSalesChannel.id,
      },
    },
  });

  logger.info('Fixing tax regions...');
  const existingTaxRegions = await taxModuleService.listTaxRegions(
    { country_code: countries },
    { select: ['id', 'country_code', 'provider_id', 'parent_id'], take: 100 },
  );
  const parentTaxRegions = existingTaxRegions.filter((r) => !r.parent_id);
  const existingCountries = new Set(
    parentTaxRegions.map((r) => r.country_code.toLowerCase()),
  );
  const missingCountries = countries.filter((code) => !existingCountries.has(code));

  if (missingCountries.length) {
    await createTaxRegionsWorkflow(container).run({
      input: missingCountries.map((country_code) => ({
        country_code,
        provider_id: taxProviderId,
      })),
    });
  }

  const regionsWithoutProvider = parentTaxRegions.filter((r) => !r.provider_id);
  if (regionsWithoutProvider.length) {
    await taxModuleService.updateTaxRegions(
      regionsWithoutProvider.map((r) => ({
        id: r.id,
        provider_id: taxProviderId,
      })),
    );
  }

  logger.info('Fixing stock location...');
  let [stockLocation] = await stockLocationService.listStockLocations(
    { name: 'Swiss Warehouse' },
    { take: 1 },
  );
  if (!stockLocation) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: 'Swiss Warehouse',
            address: {
              city: 'Meyrin',
              country_code: 'CH',
              address_1: '44 rue de la Prulay',
            },
          },
        ],
      },
    });
    stockLocation = result[0];
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });

  const shippingSets = await fulfillmentModuleService.listFulfillmentSets(
    { type: 'shipping' },
    { relations: ['service_zones', 'service_zones.geo_zones'], take: 100 },
  );
  let shippingSet = shippingSets[0];
  if (!shippingSet) {
    shippingSet = await fulfillmentModuleService.createFulfillmentSets({
      name: 'CH FR BE delivery',
      type: 'shipping',
      service_zones: [
        {
          name: 'CH FR BE',
          geo_zones: countries.map((country_code) => ({
            country_code,
            type: 'country' as const,
          })),
        },
      ],
    });
  }

  const serviceZone = shippingSet.service_zones[0];
  if (!serviceZone) {
    throw new Error('No service zone found for shipping fulfillment set.');
  }

  const existingZoneCountries = new Set(
    (serviceZone.geo_zones ?? [])
      .filter((zone) => zone.type === 'country' && typeof zone.country_code === 'string')
      .map((zone) => zone.country_code.toLowerCase()),
  );
  const missingZoneCountries = countries.filter((code) => !existingZoneCountries.has(code));
  if (missingZoneCountries.length) {
    await fulfillmentModuleService.updateServiceZones(serviceZone.id, {
      geo_zones: [
        ...(serviceZone.geo_zones || []).map((zone) => ({ id: zone.id })),
        ...missingZoneCountries.map((country_code) => ({
          country_code,
          type: 'country' as const,
        })),
      ],
    });
  }

  logger.info('Ensuring shipping profiles have CH/FR/BE methods...');
  let shippingProfiles = await fulfillmentModuleService.listShippingProfiles(
    {},
    { take: 100 },
  );

  if (!shippingProfiles.length) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [{ name: 'Default', type: 'default' }],
      },
    });
    shippingProfiles = result;
  }

  const existingShippingOptions = await fulfillmentModuleService.listShippingOptions(
    {},
    { take: 500 },
  );
  const shippingOptionsToCreate = shippingProfiles
    .filter(
      (profile) =>
        !existingShippingOptions.some(
          (option) =>
            option.service_zone_id === serviceZone.id &&
            option.shipping_profile_id === profile.id &&
            option.name === 'Poste Suisse',
        ),
    )
    .map((profile) => ({
      name: 'Poste Suisse',
      price_type: 'flat' as const,
      provider_id: 'manual_manual',
      service_zone_id: serviceZone.id,
      shipping_profile_id: profile.id,
      type: {
        label: 'Poste Suisse',
        description: 'Livraison standard CH / FR / BE',
        code: 'poste-suisse',
      },
      prices: [
        { currency_code: 'eur', amount: 7 },
        { currency_code: 'usd', amount: 7 },
        { region_id: regionId, amount: 7 },
      ],
    }));

  if (shippingOptionsToCreate.length) {
    await createShippingOptionsWorkflow(container).run({
      input: shippingOptionsToCreate,
    });
  }

  const { data: fulfillmentSetLinks } = await query.graph({
    entity: 'location_fulfillment_set',
    fields: ['stock_location_id', 'fulfillment_set_id'],
    filters: { stock_location_id: stockLocation.id, fulfillment_set_id: shippingSet.id },
  })

  if (!fulfillmentSetLinks.length) {
    await remoteLink.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: shippingSet.id,
      },
    })
  }

  const { data: providerLinks } = await query.graph({
    entity: 'location_fulfillment_provider',
    fields: ['stock_location_id', 'fulfillment_provider_id'],
    filters: {
      stock_location_id: stockLocation.id,
      fulfillment_provider_id: 'manual_manual',
    },
  })

  if (!providerLinks.length) {
    await remoteLink.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: 'manual_manual',
      },
    })
  }

  const defaultShippingProfile =
    shippingProfiles.find((profile) => profile.name === 'Default') ??
    shippingProfiles[0]

  const products = await productModuleService.listProducts(
    {},
    { take: 2000, select: ['id'] },
  )
  const { data: defaultProfileLinks } = await query.graph({
    entity: 'product_shipping_profile',
    fields: ['product_id', 'shipping_profile_id'],
    filters: { shipping_profile_id: defaultShippingProfile.id },
  })
  const linkedProductIds = new Set(defaultProfileLinks.map((link) => link.product_id))
  const productsToLink = products.filter((product) => !linkedProductIds.has(product.id))

  if (productsToLink.length) {
    await remoteLink.create(
      productsToLink.map((product) => ({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [Modules.FULFILLMENT]: {
          shipping_profile_id: defaultShippingProfile.id,
        },
      })),
    )
  }

  logger.info('Fixing variant inventory to 100...');
  const variants = await productModuleService.listProductVariants(
    {},
    { select: ['id', 'sku', 'title'], take: 2000 },
  );
  const variantIds = variants.map((variant) => variant.id);

  if (variantIds.length) {
    await productModuleService.updateProductVariants(
      { id: variantIds },
      { manage_inventory: true, allow_backorder: false },
    );

    const { data: variantInventoryLinks } = await query.graph({
      entity: 'product_variant_inventory_items',
      fields: ['variant_id', 'inventory_item_id'],
      filters: { variant_id: variantIds },
    });

    const inventoryItemByVariant = new Map<string, string>();
    variantInventoryLinks.forEach((link) => {
      if (!inventoryItemByVariant.has(link.variant_id)) {
        inventoryItemByVariant.set(link.variant_id, link.inventory_item_id);
      }
    });

    const variantsWithoutInventory = variants.filter(
      (variant) => !inventoryItemByVariant.has(variant.id),
    );

    if (variantsWithoutInventory.length) {
      const createdInventoryItems = await inventoryService.createInventoryItems(
        variantsWithoutInventory.map((variant) => ({
          sku: variant.sku || `sku-${variant.id}`,
          title: variant.title || variant.id,
          requires_shipping: true,
        })),
      );

      await remoteLink.create(
        variantsWithoutInventory.map((variant, index) => ({
          [Modules.PRODUCT]: {
            variant_id: variant.id,
          },
          [Modules.INVENTORY]: {
            inventory_item_id: createdInventoryItems[index].id,
          },
        })),
      );

      createdInventoryItems.forEach((item, index) => {
        inventoryItemByVariant.set(variantsWithoutInventory[index].id, item.id);
      });
    }

    const inventoryItemIds = Array.from(inventoryItemByVariant.values());
    const existingLevels = inventoryItemIds.length
      ? await inventoryService.listInventoryLevels(
          {
            location_id: stockLocation.id,
            inventory_item_id: inventoryItemIds,
          },
          { take: 5000 },
        )
      : [];

    const existingLevelByInventoryItem = new Map(
      existingLevels.map((level) => [level.inventory_item_id, level]),
    );

    const levelsToCreate = inventoryItemIds
      .filter((inventoryItemId) => !existingLevelByInventoryItem.has(inventoryItemId))
      .map((inventory_item_id) => ({
        inventory_item_id,
        location_id: stockLocation.id,
        stocked_quantity: 100,
      }));

    if (levelsToCreate.length) {
      await inventoryService.createInventoryLevels(levelsToCreate);
    }

    const levelsToUpdate = inventoryItemIds
      .filter((inventoryItemId) => existingLevelByInventoryItem.has(inventoryItemId))
      .map((inventoryItemId) => ({
        inventory_item_id: inventoryItemId,
        location_id: stockLocation.id,
        stocked_quantity: 100,
        incoming_quantity: 0,
      }));

    if (levelsToUpdate.length) {
      await inventoryService.updateInventoryLevels(levelsToUpdate);
    }
  }

  logger.info('CH/FR/BE checkout fix complete.');
}
