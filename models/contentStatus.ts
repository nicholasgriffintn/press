import { DataTypes } from 'sequelize';

import Roles from '../../security/roles';
import SequelizeArrayUtils from '../utils/sequelizeArrayUtils';

export default function (sequelize) {
  const contentStatus = sequelize.define(
    'contentStatus',
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
      color: {
        type: DataTypes.TEXT,
      },
      publishing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pendingReview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      scheduled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {},
      },
      global: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      roles: {
        type: SequelizeArrayUtils.DataType,
        validate: {
          isValidOption: function (value) {
            if (!value || !value.length) {
              return value;
            }

            const validOptions: any = Object.keys(
              Roles.values,
            );

            if (
              value.some(
                (item) => !validOptions.includes(item),
              )
            ) {
              throw new Error(
                `${value} is not a valid option`,
              );
            }

            return value;
          },
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
      ],
      timestamps: true,
      paranoid: true,
    },
  );

  contentStatus.associate = (models) => {
    models.contentStatus.hasMany(models.contentStatus, {
      as: 'transitionable',
      constraints: false,
      through: 'contentStatusTransitionableContentStatus',
    });

    models.contentStatus.belongsToMany(models.site, {
      as: 'site',
      constraints: false,
      through: 'contentStatusSiteSite',
    });

    models.contentStatus.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.contentStatus.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.contentStatus.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return contentStatus;
}
