import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const notification = sequelize.define(
    'notification',
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

  notification.associate = (models) => {
    models.notification.belongsToMany(models.user, {
      as: 'recipents',
      constraints: false,
      through: 'notificationRecipentsUser',
    });

    models.notification.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.notification.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.notification.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return notification;
}
