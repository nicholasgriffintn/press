import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const content = sequelize.define(
    'content',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      dueDate: {
        type: DataTypes.DATE,
      },
      publishDate: {
        type: DataTypes.DATE,
      },
      readOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      customFieldsData: {
        type: DataTypes.JSONb,
      },
      showOnMenu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      seo: {
        type: DataTypes.TEXT,
      },
      draft: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

  content.associate = (models) => {
    models.content.hasOne(models.template, {
      as: 'template',
      constraints: false,
      through: 'contentTemplateTemplate',
    });

    models.content.hasMany(models.note, {
      as: 'notes',
      constraints: false,
      through: 'contentNotesNote',
    });

    models.content.hasMany(models.task, {
      as: 'tasks',
      constraints: false,
      through: 'contentTasksTask',
    });

    models.content.hasMany(models.user, {
      as: 'contributors',
      constraints: false,
      through: 'contentContributorsUser',
    });

    models.content.belongsToMany(models.content, {
      as: 'revisions',
      constraints: false,
      through: 'contentRevisionsContent',
    });

    models.content.hasMany(models.file, {
      as: 'featuredImage',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.content.getTableName(),
        belongsToColumn: 'featuredImage',
      },
    });

    models.content.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.content.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.content.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return content;
}
