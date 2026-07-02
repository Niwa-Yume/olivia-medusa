import {
  createProductCategoriesWorkflow,
  createProductTypesWorkflow,
  createProductsWorkflow,
  createSalesChannelsWorkflow,
  deleteProductsWorkflow,
  uploadFilesWorkflow,
} from '@medusajs/medusa/core-flows';
import {
  ExecArgs,
  IProductModuleService,
  ISalesChannelModuleService,
} from '@medusajs/framework/types';
import { ContainerRegistrationKeys, Modules, ProductStatus } from '@medusajs/framework/utils';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

type CategorySeed = {
  name: string;
  handle: string;
};

type ProductSeed = {
  title: string;
  handle: string;
  description: string;
  categoryHandle: string;
  family: 'bijoux' | 'vetements' | 'accessoires';
  variant: {
    title: string;
    sku: string;
    optionValue: string;
    eurAmount: number;
    usdAmount: number;
  };
};

const CATEGORY_SEED: CategorySeed[] = [
  { name: 'Colliers', handle: 'colliers' },
  { name: 'Ensembles', handle: 'ensembles' },
  { name: 'Robes', handle: 'robes' },
  { name: 'Vestes', handle: 'vestes' },
  { name: 'Sacs', handle: 'sacs' },
  { name: 'Boucles', handle: 'boucles' },
  { name: 'Ceintures', handle: 'ceintures' },
  { name: 'Bracelets', handle: 'bracelets' },
  { name: 'Foulards', handle: 'foulards' },
];

const DEMO_PRODUCT_HANDLES = [
  'astrid-curve',
  'belime-estate',
  'cypress-retreat',
  'everly-estate',
  'havenhill-estate',
  'monaco-flair',
  'nordic-breeze',
  'nordic-haven',
  'oslo-drift',
  'oslo-serenity',
  'paloma-haven',
  'savannah-grove',
  'serena-meadow',
  'sutton-royale',
  'velar-loft',
  'velora-luxe',
];

const PRODUCT_SEED: ProductSeed[] = [
  {
    title: 'Collier Gaia dore',
    handle: 'collier-gaia-dore',
    description:
      'Collier fin dore a la main, pense pour illuminer une tenue du quotidien comme une silhouette de soiree.',
    categoryHandle: 'colliers',
    family: 'bijoux',
    variant: {
      title: 'Dore satine',
      sku: 'COL-GAIA-DORE-SATINE',
      optionValue: 'Dore satine',
      eurAmount: 8900,
      usdAmount: 9900,
    },
  },
  {
    title: 'Boucles Luna perlees',
    handle: 'boucles-luna-perlees',
    description:
      'Boucles legeres avec perles nacrees, montage artisanal et fermoir confortable pour un port quotidien.',
    categoryHandle: 'boucles',
    family: 'bijoux',
    variant: {
      title: 'Perle ivoire',
      sku: 'BOU-LUNA-PERLE-IVOIRE',
      optionValue: 'Perle ivoire',
      eurAmount: 6900,
      usdAmount: 7900,
    },
  },
  {
    title: 'Bracelet Alma maille fine',
    handle: 'bracelet-alma-maille-fine',
    description:
      'Bracelet maille fine compose en petite serie, ideal pour superposition ou port solo.',
    categoryHandle: 'bracelets',
    family: 'bijoux',
    variant: {
      title: 'Argent poli',
      sku: 'BRA-ALMA-ARGENT-POLI',
      optionValue: 'Argent poli',
      eurAmount: 5400,
      usdAmount: 6200,
    },
  },
  {
    title: 'Robe Celeste drapee',
    handle: 'robe-celeste-drapee',
    description:
      'Robe drapee cousue main avec coupe flatteuse et tissu fluide, pensee pour des occasions elegantes.',
    categoryHandle: 'robes',
    family: 'vetements',
    variant: {
      title: 'Taille unique',
      sku: 'ROB-CELESTE-TAILLE-UNIQUE',
      optionValue: 'Taille unique',
      eurAmount: 24900,
      usdAmount: 27900,
    },
  },
  {
    title: 'Veste Aria structuree',
    handle: 'veste-aria-structuree',
    description:
      'Veste structuree avec finitions soignees, confectionnee en atelier pour un rendu chic et durable.',
    categoryHandle: 'vestes',
    family: 'vetements',
    variant: {
      title: 'Taille M',
      sku: 'VES-ARIA-TAILLE-M',
      optionValue: 'Taille M',
      eurAmount: 28900,
      usdAmount: 31900,
    },
  },
  {
    title: 'Ensemble Sofia satin mat',
    handle: 'ensemble-sofia-satin-mat',
    description:
      'Ensemble coordonne en satin mat, coupe confortable et ligne elegante pour un look complet.',
    categoryHandle: 'ensembles',
    family: 'vetements',
    variant: {
      title: 'Taille S-M',
      sku: 'ENS-SOFIA-TAILLE-SM',
      optionValue: 'Taille S-M',
      eurAmount: 32900,
      usdAmount: 35900,
    },
  },
  {
    title: 'Sac Naya cuir souple',
    handle: 'sac-naya-cuir-souple',
    description:
      'Sac en cuir souple avec poches interieures et bandouliere reglable, fabrique en petite serie.',
    categoryHandle: 'sacs',
    family: 'accessoires',
    variant: {
      title: 'Noir profond',
      sku: 'SAC-NAYA-NOIR-PROFOND',
      optionValue: 'Noir profond',
      eurAmount: 21900,
      usdAmount: 24900,
    },
  },
  {
    title: 'Ceinture Iris boucle doree',
    handle: 'ceinture-iris-boucle-doree',
    description:
      'Ceinture artisanale en cuir lisse, boucle doree et finitions bord-cote pour structurer la silhouette.',
    categoryHandle: 'ceintures',
    family: 'accessoires',
    variant: {
      title: 'Longueur 90 cm',
      sku: 'CEI-IRIS-90CM',
      optionValue: 'Longueur 90 cm',
      eurAmount: 7900,
      usdAmount: 9100,
    },
  },
  {
    title: 'Foulard Mila imprime',
    handle: 'foulard-mila-imprime',
    description:
      'Foulard leger imprime realise en atelier, ideal autour du cou, en bandeau ou sur un sac.',
    categoryHandle: 'foulards',
    family: 'accessoires',
    variant: {
      title: 'Edition atelier',
      sku: 'FOU-MILA-EDITION-ATELIER',
      optionValue: 'Edition atelier',
      eurAmount: 4900,
      usdAmount: 5600,
    },
  },
];

const FAMILY_IMAGE_FILES = {
  bijoux: {
    filePath: path.resolve(
      process.cwd(),
      '..',
      'storefront',
      'public',
      'images',
      'content',
      'OliviaBijoux.jpeg',
    ),
    filename: 'seed-bijoux.jpeg',
  },
  vetements: {
    filePath: path.resolve(
      process.cwd(),
      '..',
      'storefront',
      'public',
      'images',
      'content',
      'OliviaVetements.jpeg',
    ),
    filename: 'seed-vetements.jpeg',
  },
  accessoires: {
    filePath: path.resolve(
      process.cwd(),
      '..',
      'storefront',
      'public',
      'images',
      'content',
      'OliviaAccessoire.jpeg',
    ),
    filename: 'seed-accessoires.jpeg',
  },
} as const;

const normalizeLabel = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const TYPE_VALUE_BY_FAMILY = {
  bijoux: 'Bijoux',
  vetements: 'Vêtements',
  accessoires: 'Accessoires',
} as const;

const COLLECTION_HANDLE_BY_FAMILY = {
  bijoux: 'eclat-dore',
  vetements: 'atelier-capsule',
  accessoires: 'essentiels-cuir',
} as const;

async function readFileAsBase64(filePath: string) {
  const file = await readFile(filePath);
  return file.toString('base64');
}

export default async function seedOprocacciniCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService: IProductModuleService = container.resolve(
    Modules.PRODUCT,
  );
  const salesChannelModuleService: ISalesChannelModuleService =
    container.resolve(Modules.SALES_CHANNEL);

  logger.info('Seeding Oprocaccini catalog (categories + products)...');

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

  const defaultSalesChannelId = defaultSalesChannels[0].id;

  const existingCategories = await productModuleService.listProductCategories(
    {},
    {
      take: 200,
      select: ['id', 'name', 'handle'],
    },
  );

  const existingCategoryHandles = new Set(
    existingCategories.map((category) => category.handle),
  );

  const missingCategories = CATEGORY_SEED.filter(
    (category) => !existingCategoryHandles.has(category.handle),
  );

  if (missingCategories.length) {
    let createdCategoriesCount = 0;

    for (const category of missingCategories) {
      try {
        await createProductCategoriesWorkflow(container).run({
          input: {
            product_categories: [
              {
                name: category.name,
                handle: category.handle,
                is_active: true,
                is_internal: false,
              },
            ],
          },
        });

        createdCategoriesCount += 1;
      } catch (error) {
        const message =
          typeof (error as { message?: unknown })?.message === 'string'
            ? ((error as { message: string }).message || '').toLowerCase()
            : '';
        const isDuplicateHandleError =
          message.includes('already exists') && message.includes('handle');

        if (!isDuplicateHandleError) {
          throw error;
        }

        logger.info(
          `Category ${category.handle} already exists, skipping creation.`,
        );
      }
    }

    logger.info(`Created ${createdCategoriesCount} missing categories.`);
  } else {
    logger.info('All target categories already exist.');
  }

  const categories = await productModuleService.listProductCategories(
    {},
    {
      take: 200,
      select: ['id', 'name', 'handle'],
    },
  );

  const categoryIdByHandle = new Map<string, string>();
  const categoryIdByName = new Map<string, string>();

  categories.forEach((category) => {
    if (typeof category.handle === 'string' && category.handle.length) {
      categoryIdByHandle.set(category.handle, category.id);
    }

    if (typeof category.name === 'string' && category.name.length) {
      categoryIdByName.set(normalizeLabel(category.name), category.id);
    }
  });

  const resolveCategoryId = (categoryHandle: string) =>
    categoryIdByHandle.get(categoryHandle) ||
    categoryIdByName.get(normalizeLabel(categoryHandle));

  const missingCategoryForProducts = PRODUCT_SEED.find((product) =>
    !resolveCategoryId(product.categoryHandle),
  );

  if (missingCategoryForProducts) {
    throw new Error(
      `Missing category id for handle "${missingCategoryForProducts.categoryHandle}"`,
    );
  }

  const requiredTypeValues = Array.from(
    new Set(PRODUCT_SEED.map((product) => TYPE_VALUE_BY_FAMILY[product.family])),
  );

  const existingTypes = await productModuleService.listProductTypes(
    {},
    { take: 100, select: ['id', 'value'] },
  );

  const missingTypeValues = requiredTypeValues.filter(
    (requiredTypeValue) =>
      !existingTypes.some(
        (type) =>
          normalizeLabel(type.value || '') === normalizeLabel(requiredTypeValue),
      ),
  );

  if (missingTypeValues.length) {
    await createProductTypesWorkflow(container).run({
      input: {
        product_types: missingTypeValues.map((value) => ({ value })),
      },
    });

    logger.info(`Created ${missingTypeValues.length} missing product types.`);
  }

  const productTypes = await productModuleService.listProductTypes(
    {},
    { take: 100, select: ['id', 'value'] },
  );

  const typeIdByFamily = new Map<ProductSeed['family'], string>();

  (Object.keys(TYPE_VALUE_BY_FAMILY) as ProductSeed['family'][]).forEach(
    (family) => {
      const typeValue = TYPE_VALUE_BY_FAMILY[family];
      const matchingType = productTypes.find(
        (type) =>
          normalizeLabel(type.value || '') === normalizeLabel(typeValue),
      );

      if (matchingType?.id) {
        typeIdByFamily.set(family, matchingType.id);
      }
    },
  );

  const missingTypeFamily = (Object.keys(TYPE_VALUE_BY_FAMILY) as ProductSeed['family'][]).find(
    (family) => !typeIdByFamily.get(family),
  );

  if (missingTypeFamily) {
    throw new Error(
      `Missing product type id for family "${missingTypeFamily}"`,
    );
  }

  const collections = await productModuleService.listProductCollections(
    {},
    { take: 100, select: ['id', 'handle'] },
  );

  const collectionIdByFamily = new Map<ProductSeed['family'], string>();

  (Object.keys(COLLECTION_HANDLE_BY_FAMILY) as ProductSeed['family'][]).forEach(
    (family) => {
      const collectionHandle = COLLECTION_HANDLE_BY_FAMILY[family];
      const matchingCollection = collections.find(
        (collection) => collection.handle === collectionHandle,
      );

      if (matchingCollection?.id) {
        collectionIdByFamily.set(family, matchingCollection.id);
      }
    },
  );

  const handlesToDelete = [
    ...DEMO_PRODUCT_HANDLES,
    ...PRODUCT_SEED.map((product) => product.handle),
  ];

  const existingProducts = await productModuleService.listProducts(
    { handle: handlesToDelete },
    { select: ['id', 'handle', 'title'] },
  );

  if (existingProducts.length) {
    await deleteProductsWorkflow(container).run({
      input: {
        ids: existingProducts.map((product) => product.id),
      },
    });

    logger.info(`Deleted ${existingProducts.length} demo/old products.`);
  }

  const familyImageUploadInput = Object.entries(FAMILY_IMAGE_FILES).map(
    ([family, config]) => ({
      access: 'public' as const,
      filename: config.filename,
      mimeType: 'image/jpeg',
      content: undefined as string | undefined,
      family,
      filePath: config.filePath,
    }),
  );

  for (const fileInput of familyImageUploadInput) {
    fileInput.content = await readFileAsBase64(fileInput.filePath);
  }

  const { result: uploadedFamilyImages } = await uploadFilesWorkflow(container).run({
    input: {
      files: familyImageUploadInput.map(({ access, filename, mimeType, content }) => ({
        access,
        filename,
        mimeType,
        content: content!,
      })),
    },
  });

  const familyImageByKey = new Map<string, string>();

  familyImageUploadInput.forEach((fileInput, index) => {
    familyImageByKey.set(fileInput.family, uploadedFamilyImages[index].url);
  });

  await createProductsWorkflow(container).run({
    input: {
      products: PRODUCT_SEED.map((product) => {
        const collectionId = collectionIdByFamily.get(product.family);

        return {
          title: product.title,
          handle: product.handle,
          description: product.description,
          status: ProductStatus.PUBLISHED,
          category_ids: [resolveCategoryId(product.categoryHandle)!],
          type_id: typeIdByFamily.get(product.family)!,
          ...(collectionId ? { collection_id: collectionId } : {}),
          images: [{ url: familyImageByKey.get(product.family)! }],
          options: [
            {
              title: 'Version',
              values: [product.variant.optionValue],
            },
          ],
          variants: [
            {
              title: product.variant.title,
              sku: product.variant.sku,
              options: {
                Version: product.variant.optionValue,
              },
              manage_inventory: false,
              prices: [
                {
                  amount: product.variant.eurAmount,
                  currency_code: 'eur',
                },
                {
                  amount: product.variant.usdAmount,
                  currency_code: 'usd',
                },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannelId }],
        };
      }),
    },
  });

  logger.info(`Created ${PRODUCT_SEED.length} Oprocaccini products.`);
  logger.info('Oprocaccini catalog seed complete.');
}

