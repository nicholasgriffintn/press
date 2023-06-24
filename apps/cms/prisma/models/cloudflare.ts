import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const cloudflare = sequelize.define(
    'cloudflare',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      zone: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.TEXT,
      },
      apiKey: {
        type: DataTypes.TEXT,
      },
      accountId: {
        type: DataTypes.TEXT,
      },
      pages: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pagesName: {
        type: DataTypes.TEXT,
      },
      analytics: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      dnsEditing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      dnsReadKey: {
        type: DataTypes.TEXT,
      },
      dnsEditKey: {
        type: DataTypes.TEXT,
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

      ],
      timestamps: true,
      paranoid: true,
    },
  );

  cloudflare.associate = (models) => {
    models.cloudflare.belongsTo(models.site, {
      as: 'site',
      constraints: false,
    });


    
    models.cloudflare.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.cloudflare.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.cloudflare.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return cloudflare;
}
