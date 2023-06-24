import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const compliance = sequelize.define(
    'compliance',
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
        }
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [[
            "untracked",
            "pending",
            "past_review",
            "due_for_review",
            "compliant"
          ]],
        }
      },
      priority: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [[
            "p1",
            "p2",
            "p3",
            "p4",
            "p5"
          ]],
        }
      },
      reviewed: {
        type: DataTypes.DATE,
      },
      frequency: {
        type: DataTypes.INTEGER,
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

  compliance.associate = (models) => {
    models.compliance.belongsTo(models.site, {
      as: 'site',
      constraints: false,
    });

    models.compliance.belongsTo(models.content, {
      as: 'content',
      constraints: false,
    });


    
    models.compliance.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.compliance.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.compliance.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return compliance;
}
