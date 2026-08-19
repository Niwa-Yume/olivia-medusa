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
  IRegionModuleService,
  ISalesChannelModuleService,
  IStoreModuleService,
  ITaxModuleService,
  RegionDTO,
} from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';

const PAYMENT_PROVIDER_ID = 'pp_stripe_stripe';
const TAX_PROVIDER_ID = 'tp_system';

export default async function seedProd({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const remoteLink = container.resolve(ContainerRegistrationKeys.LINK);

  const salesChannelModuleService: ISalesChannelModuleService =
    container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService: IStoreModuleService = container.resolve(Modules.STORE);
  const regionModuleService: IRegionModuleService = container.resolve(Modules.REGION);
  const taxModuleService: ITaxModuleService = container.resolve(Modules.TAX);
  const fulfillmentModuleService: IFulfillmentModuleService =
    container.resolve(Modules.FULFILLMENT);

  logger.info('Seeding Swiss production setup...');

  let [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({
    name: 'Default Sales Channel',
  });

  if (!defaultSalesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: 'Default Sales Channel' }],
      },
    });
    defaultSalesChannel = result[0];
  }

  const [existingSwissRegion] = await regionModuleService.listRegions(
    {
      name: 'Switzerland',
    },
    {
      take: 1,
    },
  );

  let swissRegion: RegionDTO;

  if (existingSwissRegion) {
    const { result } = await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: existingSwissRegion.id },
        update: {
          currency_code: 'chf',
          countries: ['ch'],
          payment_providers: [PAYMENT_PROVIDER_ID],
          automatic_taxes: true,
        },
      },
    });
    swissRegion = result[0];
  } else {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: 'Switzerland',
            currency_code: 'chf',
            countries: ['ch'],
            payment_providers: [PAYMENT_PROVIDER_ID],
            automatic_taxes: true,
          },
        ],
      },
    });
    swissRegion = result[0];
  }

  const [store] = await storeModuleService.listStores();
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [{ currency_code: 'chf', is_default: true }],
        default_sales_channel_id: defaultSalesChannel.id,
        default_region_id: swissRegion.id,
      },
    },
  });

  const existingTaxRegions = await taxModuleService.listTaxRegions(
    { country_code: ['ch'] },
    { select: ['id', 'country_code', 'provider_id', 'parent_id'], take: 20 },
  );

  const parentSwissTaxRegion = existingTaxRegions.find(
    (taxRegion) =>
      !taxRegion.parent_id && taxRegion.country_code.toLowerCase() === 'ch',
  );

  if (!parentSwissTaxRegion) {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: 'ch', provider_id: TAX_PROVIDER_ID }],
    });
  } else if (!parentSwissTaxRegion.provider_id) {
    await taxModuleService.updateTaxRegions([
      { id: parentSwissTaxRegion.id, provider_id: TAX_PROVIDER_ID },
    ]);
  }

  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container,
  ).run({
    input: {
      locations: [
        {
          name: 'Swiss Warehouse',
          address: {
            city: 'Lausanne',
            country_code: 'CH',
            address_1: '',
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await remoteLink.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: 'manual_manual',
    },
  });

  let [shippingProfile] = await fulfillmentModuleService.listShippingProfiles(
    { name: 'Default' },
    { take: 1 },
  );

  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [{ name: 'Default', type: 'default' }],
      },
    });
    shippingProfile = result[0];
  }

  let [swissFulfillmentSet] = await fulfillmentModuleService.listFulfillmentSets(
    { name: 'Swiss delivery' },
    {
      take: 1,
      relations: ['service_zones', 'service_zones.geo_zones'],
    },
  );

  const hadSwissFulfillmentSet = Boolean(swissFulfillmentSet);

  if (!swissFulfillmentSet) {
    swissFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: 'Swiss delivery',
      type: 'shipping',
      service_zones: [
        {
          name: 'Switzerland',
          geo_zones: [{ country_code: 'ch', type: 'country' }],
        },
      ],
    });
  }

  if (!hadSwissFulfillmentSet) {
    await remoteLink.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: swissFulfillmentSet.id,
      },
    });
  }

  const swissServiceZoneId = swissFulfillmentSet.service_zones[0].id;
  const existingSwissOption = await fulfillmentModuleService.listShippingOptions(
    { name: ['Poste Suisse'] },
    { take: 20 },
  );

  if (
    !existingSwissOption.some(
      (option) => option.service_zone_id === swissServiceZoneId,
    )
  ) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: 'Poste Suisse',
          price_type: 'flat',
          provider_id: 'manual_manual',
          service_zone_id: swissServiceZoneId,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: 'Poste Suisse',
            description: 'Livraison standard en Suisse.',
            code: 'poste-suisse',
          },
          prices: [
            {
              currency_code: 'chf',
              amount: 7,
            },
            {
              region_id: swissRegion.id,
              amount: 7,
            },
          ],
          rules: [
            {
              attribute: 'enabled_in_store',
              value: '"true"',
              operator: 'eq',
            },
            {
              attribute: 'is_return',
              value: 'false',
              operator: 'eq',
            },
          ],
        },
      ],
    });
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });

  logger.info('Swiss production setup complete (1 shipping profile, CH only).');
}
