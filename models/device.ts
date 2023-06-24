import { DataTypes } from 'sequelize';import moment from 'moment';

export default function (sequelize) {
  const device = sequelize.define(
    'device',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      deviceId: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      verificationStatus: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [[
            "verified",
            "unverified"
          ]],
        }
      },
      verificationDate: {
        type: DataTypes.DATEONLY,
        get: function() {
          // @ts-ignore
          return this.getDataValue('verificationDate')
            ? moment
                // @ts-ignore
                .utc(this.getDataValue('verificationDate'))
                .format('YYYY-MM-DD')
            : null;
        },
      },
      verificationToken: {
        type: DataTypes.TEXT,
      },
      verificationExp: {
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
        {
          unique: true,
          fields: ['deviceId', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },
      ],
      timestamps: true,
      paranoid: true,
    },
  );

  device.associate = (models) => {



    
    models.device.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.device.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.device.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return device;
}
