import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const deployment = sequelize.define(
    'deployment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      status: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [['pending', 'in_progress', 'complete']],
        },
      },
      record: {
        type: DataTypes.JSONb,
      },
      lastUpdated: {
        type: DataTypes.DATE,
      },
      published: {
        type: DataTypes.DATE,
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

  deployment.associate = (models) => {
    models.deployment.belongsTo(models.site, {
      as: 'site',
      constraints: false,
    });

    models.deployment.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.deployment.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.deployment.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return deployment;
}
