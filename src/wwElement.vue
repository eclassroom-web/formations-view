<template>
  <div class="formations-view">
    <!-- Toolbar -->
    <div class="toolbar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher une formation..."
        class="search-input"
      />
      <div class="toolbar-right">
        <button class="btn-create" @click="$emit('create-formation')">
          + Nouvelle formation
        </button>
        <div class="view-toggle">
          <button
            :class="['toggle-btn', { active: viewMode === 'list' }]"
            title="Vue liste"
            @click="viewMode = 'list'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
            </svg>
          </button>
          <button
            :class="['toggle-btn', { active: viewMode === 'grid' }]"
            title="Vue grille"
            @click="viewMode = 'grid'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Grid view -->
    <div v-if="viewMode === 'grid'" class="grid-view">
      <div
        v-for="formation in filteredFormations"
        :key="formation.id"
        class="formation-card"
      >
        <div class="card-cover" :style="getCoverStyle(formation)">
          <img
            v-if="formation.cover_image"
            :src="formation.cover_image"
            :alt="formation.title"
            class="cover-img"
          />
          <span :class="['card-badge', formation.published ? 'badge-published' : 'badge-draft']">
            {{ formation.published ? 'Publié' : 'Brouillon' }}
          </span>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ formation.title }}</h3>
          <div class="card-meta">
            <span v-if="formation.category" class="meta-tag">{{ formation.category }}</span>
            <span v-if="formation.level" class="meta-tag meta-level">{{ formation.level }}</span>
          </div>
          <div class="card-actions">
            <button class="btn-toggle-publish" @click="togglePublish(formation)">
              {{ formation.published ? 'Dépublier' : 'Publier' }}
            </button>
            <button class="btn-edit" @click="$emit('edit-formation', { id: formation.id })">
              Modifier
            </button>
          </div>
        </div>
      </div>
      <p v-if="filteredFormations.length === 0" class="empty-state">
        Aucune formation trouvée.
      </p>
    </div>

    <!-- List view -->
    <div v-else class="list-view">
      <table class="formations-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Niveau</th>
            <th>Créé le</th>
            <th>Publié</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="formation in filteredFormations"
            :key="formation.id"
            class="table-row"
          >
            <td class="td-title">{{ formation.title }}</td>
            <td><span class="meta-tag">{{ formation.category }}</span></td>
            <td><span class="meta-tag meta-level">{{ formation.level }}</span></td>
            <td class="td-date">{{ formatDate(formation.created_at) }}</td>
            <td>
              <button
                :class="['publish-toggle', formation.published ? 'published' : 'draft']"
                @click="togglePublish(formation)"
              >
                <span class="toggle-dot" />
              </button>
            </td>
            <td class="td-actions">
              <button
                class="btn-edit-sm"
                @click="$emit('edit-formation', { id: formation.id })"
              >
                Modifier
              </button>
            </td>
          </tr>
          <tr v-if="filteredFormations.length === 0">
            <td colspan="6" class="empty-cell">Aucune formation trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const CATEGORY_GRADIENTS = {
  Développement: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%)',
  Design: 'linear-gradient(135deg, #4a1942 0%, #f97316 100%)',
  Marketing: 'linear-gradient(135deg, #3d1a00 0%, #c2410c 100%)',
  Bureautique: 'linear-gradient(135deg, #1a3a4a 0%, #0369a1 100%)',
  Management: 'linear-gradient(135deg, #3a1a1a 0%, #9b1c1c 100%)',
};
const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1f2937 0%, #374151 100%)';

export default {
  props: {
    content: { type: Object, required: true },
  },
  emits: ['publish-change', 'edit-formation', 'create-formation'],
  data() {
    return {
      viewMode: 'list',
      searchQuery: '',
    };
  },
  computed: {
    formations() {
      return this.content?.formations || [];
    },
    filteredFormations() {
      const q = this.searchQuery.trim().toLowerCase();
      if (!q) return this.formations;
      return this.formations.filter(f => (f.title || '').toLowerCase().includes(q));
    },
  },
  methods: {
    getCoverStyle(formation) {
      if (formation.cover_image) return {};
      return { background: CATEGORY_GRADIENTS[formation.category] || DEFAULT_GRADIENT };
    },
    formatDate(dateStr) {
      if (!dateStr) return '—';
      return new Date(dateStr).toLocaleDateString('fr-FR');
    },
    togglePublish(formation) {
      const newStatus = formation.published ? 'draft' : 'published';
      this.$emit('publish-change', { formation_id: formation.id, status: newStatus });
    },
  },
};
</script>

<style lang="scss" scoped>
.formations-view {
  background: #0d1117;
  min-height: 100%;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #e6edf3;
  box-sizing: border-box;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 8px 14px;
  color: #e6edf3;
  font-size: 14px;
  width: 280px;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder { color: #6e7681; }
  &:focus { border-color: #f97316; }
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-create {
  background: #f97316;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #ea6c0a; }
}

.view-toggle {
  display: flex;
  border: 1px solid #30363d;
  border-radius: 6px;
  overflow: hidden;
}

.toggle-btn {
  background: transparent;
  border: none;
  padding: 7px 10px;
  color: #6e7681;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s, color 0.2s;

  &.active { background: #f97316; color: #fff; }
  &:not(.active):hover { background: #21262d; color: #e6edf3; }
}

/* Grid */
.grid-view {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.formation-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;

  &:hover { border-color: #f97316; transform: translateY(-2px); }
}

.card-cover {
  position: relative;
  height: 140px;
  background: #21262d;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;

  &.badge-published {
    background: rgba(22, 163, 74, 0.2);
    color: #4ade80;
    border: 1px solid rgba(74, 222, 128, 0.3);
  }

  &.badge-draft {
    background: rgba(161, 161, 170, 0.1);
    color: #a1a1aa;
    border: 1px solid rgba(161, 161, 170, 0.2);
  }
}

.card-body { padding: 16px; }

.card-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #e6edf3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.meta-tag {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  color: #8b949e;
}

.meta-level {
  border-color: rgba(249, 115, 22, 0.3);
  color: #fdba74;
}

.card-actions { display: flex; gap: 8px; }

.btn-toggle-publish {
  flex: 1;
  background: transparent;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  color: #8b949e;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: #4ade80; color: #4ade80; }
}

.btn-edit {
  background: #f97316;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #ea6c0a; }
}

/* List */
.list-view { overflow-x: auto; }

.formations-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    background: #161b22;
    color: #8b949e;
    font-weight: 500;
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid #30363d;
    white-space: nowrap;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #21262d;
    color: #e6edf3;
  }

  .table-row:hover td { background: #161b22; }
}

.td-title {
  font-weight: 500;
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.td-date { color: #8b949e; white-space: nowrap; }

.publish-toggle {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  border: none;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: background 0.2s;

  &.published { background: #f97316; justify-content: flex-end; }
  &.draft { background: #30363d; justify-content: flex-start; }
}

.toggle-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  display: block;
}

.td-actions { white-space: nowrap; }

.btn-edit-sm {
  background: transparent;
  border: 1px solid #f97316;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 13px;
  color: #fdba74;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #f97316; color: #fff; }
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px;
  color: #6e7681;
  font-size: 14px;
}

.empty-cell {
  text-align: center;
  padding: 48px 16px;
  color: #6e7681;
}
</style>
