import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const workflow = sequelize.define(
    'workflow',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      statement: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [[
            "if",
            "else",
            "else_if"
          ]],
        }
      },
      compare: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [[
            "task",
            "template",
            "parent",
            "contributors",
            "publish_date",
            "show_on_menu"
          ]],
        }
      },
      condition: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [[
            "=",
            ">",
            "<",
            "<=",
            ">=",
            "!="
          ]],
        }
      },
      values: {
        type: DataTypes.TEXT,
      },
      task: {
        type: DataTypes.TEXT,
        validate: {
          isIn: [[
            "restrict_publlish",
            "restrict_save"
          ]],
        }
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

  workflow.associate = (models) => {



    
    models.workflow.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.workflow.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.workflow.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return workflow;
}
