import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const response = sequelize.define(
    'response',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      payload: {
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
      ],
      timestamps: true,
      paranoid: true,
    },
  );

  response.associate = (models) => {
    models.response.belongsTo(models.form, {
      as: 'form',
      constraints: false,
    });

    models.response.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.response.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.response.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return response;
}
