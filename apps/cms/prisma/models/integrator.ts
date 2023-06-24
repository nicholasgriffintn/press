import { DataTypes } from 'sequelize';
import moment from 'moment';

import Roles from '../../security/roles';
import SequelizeArrayUtils from '../utils/sequelizeArrayUtils';

export default function (sequelize) {
  const integrator = sequelize.define(
    'integrator',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accessToken: {
        type: DataTypes.TEXT,
      },
      secretKey: {
        type: DataTypes.TEXT,
      },
      expiry: {
        type: DataTypes.DATEONLY,
        get: function () {
          // @ts-ignore
          return this.getDataValue('expiry')
            ? moment
                // @ts-ignore
                .utc(this.getDataValue('expiry'))
                .format('YYYY-MM-DD')
            : null;
        },
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

  integrator.associate = (models) => {
    models.integrator.belongsTo(models.site, {
      as: 'site',
      constraints: false,
    });

    models.integrator.belongsTo(models.user, {
      as: 'owner',
      constraints: false,
    });

    models.integrator.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.integrator.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.integrator.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return integrator;
}
