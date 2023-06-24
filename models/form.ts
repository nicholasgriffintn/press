import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const form = sequelize.define(
    'form',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
      },
      provider: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [['press']],
        },
      },
      status: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [['public', 'private']],
        },
      },
      json: {
        type: DataTypes.JSONb,
      },
      revision: {
        type: DataTypes.INTEGER,
      },
      key: {
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

  form.associate = (models) => {
    models.form.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.form.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.form.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return form;
}
