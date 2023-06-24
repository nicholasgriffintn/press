import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const template = sequelize.define(
    'template',
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
      showPreview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      useVisualEditor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      json: {
        type: DataTypes.JSONb,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
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

  template.associate = (models) => {
    models.template.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.template.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.template.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return template;
}
