import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const type = sequelize.define(
    'type',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      slug: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      global: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
          fields: ['title', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
      ],
      timestamps: true,
      paranoid: true,
    },
  );

  type.associate = (models) => {
    models.type.belongsToMany(models.site, {
      as: 'sites',
      constraints: false,
      through: 'typeSitesSite',
    });

    models.type.belongsToMany(models.customField, {
      as: 'customFields',
      constraints: false,
      through: 'typeCustomFieldsCustomField',
    });

    models.type.hasMany(models.file, {
      as: 'icon',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.type.getTableName(),
        belongsToColumn: 'icon',
      },
    });
    
    models.type.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.type.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.type.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return type;
}
