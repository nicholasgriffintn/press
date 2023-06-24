import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const site = sequelize.define(
    'site',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      tagManagerID: {
        type: DataTypes.TEXT,
      },
      googleAnalyticsID: {
        type: DataTypes.TEXT,
      },
      themeColor: {
        type: DataTypes.TEXT,
      },
      language: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [['en']],
        },
      },
      activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      url: {
        type: DataTypes.TEXT,
      },
      webhook: {
        type: DataTypes.TEXT,
      },
      sns: {
        type: DataTypes.TEXT,
      },
      codepipeline: {
        type: DataTypes.TEXT,
      },
      changesAwaitingPublish: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cloudfront: {
        type: DataTypes.TEXT,
      },
      bucket: {
        type: DataTypes.TEXT,
      },
      slack: {
        type: DataTypes.TEXT,
      },
      buildsPerDay: {
        type: DataTypes.INTEGER,
      },
      buildsPerMin: {
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.TEXT,
      },
      twitter: {
        type: DataTypes.TEXT,
      },
      facebook: {
        type: DataTypes.TEXT,
      },
      theme: {
        type: DataTypes.JSONb,
      },
      menus: {
        type: DataTypes.JSONb,
      },
      widgets: {
        type: DataTypes.JSONb,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['importHash', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
        {
          unique: true,
          fields: ['name', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
      ],
      timestamps: true,
      paranoid: true,
    },
  );

  site.associate = (models) => {
    models.site.belongsTo(models.provider, {
      as: 'provider',
      constraints: false,
    });

    models.site.hasMany(models.file, {
      as: 'avatar',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.site.getTableName(),
        belongsToColumn: 'avatar',
      },
    });

    models.site.hasMany(models.file, {
      as: 'logo',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.site.getTableName(),
        belongsToColumn: 'logo',
      },
    });

    models.site.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.site.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.site.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return site;
}
