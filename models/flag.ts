import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const flag = sequelize.define(
    'flag',
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

  flag.associate = (models) => {
    models.flag.belongsToMany(models.user, {
      as: 'users',
      constraints: false,
      through: 'flagUsersUser',
    });

    models.flag.belongsToMany(models.site, {
      as: 'sites',
      constraints: false,
      through: 'flagSitesSite',
    });

    models.flag.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.flag.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.flag.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return flag;
}
