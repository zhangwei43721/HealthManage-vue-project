<template>
  <div class="role-manage-container p-5 bg-background-DEFAULT min-h-[calc(100vh-84px)]">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-text-primary mb-2">角色权限管理</h1>
      <p class="text-base text-text-secondary">管理系统角色及其对应的权限设置</p>
    </div>

    <!-- 搜索与操作区域 -->
    <Card class="mb-5" elevation="small" :maxWidth="false">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- 搜索表单 -->
        <div class="flex items-center gap-2 flex-wrap">
          <InputField v-model="searchModel.roleName" placeholder="输入角色名称搜索" :leftIcon="Search" size="medium"
            class="w-full md:w-60" @keyup.enter="getRoleList" />
          <Button @click="getRoleList" type="primary" :icon="Search" :loading="listLoading">
            查询
          </Button>
          <Button @click="resetSearch" type="outline" :icon="Refresh">
            重置
          </Button>
        </div>
        <!-- 操作按钮 -->
        <div class="flex-shrink-0">
          <Button @click="openDialog()" type="secondary" :icon="Plus">
            新增角色
          </Button>
        </div>
      </div>
    </Card>

    <!-- 结果列表 -->
    <Card elevation="small" :maxWidth="false">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-text-primary">角色列表</h2>
        <span class="text-sm text-text-secondary">共 {{ total }} 条记录</span>
      </div>

      <!-- 加载状态 -->
      <div v-if="listLoading" class="text-center py-10 text-text-secondary">
        加载中...
      </div>

      <!-- 表格 -->
      <div v-else-if="roleList.length > 0" class="overflow-x-auto">
        <table class="w-full table-auto border-collapse text-left">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">角色ID</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">角色名称</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">角色描述</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider text-center">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="role in roleList" :key="role.roleId"
              class="hover:bg-background-light transition-colors duration-150">
              <td class="px-4 py-3 text-sm text-text-primary align-middle">{{ role.roleId }}</td>
              <td class="px-4 py-3 text-sm text-text-primary align-middle">
                <span class="inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded">
                  {{ role.roleName }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary align-middle max-w-xs truncate" :title="role.roleDesc">{{
                role.roleDesc }}</td>
              <td class="px-4 py-3 text-center align-middle">
                <div class="flex justify-center items-center gap-2">
                  <Button @click="openDialog(role.roleId)" type="primary" :icon="Edit" size="small" iconOnly
                    tooltip="编辑"></Button>
                  <Button @click="deleteRole(role)" type="danger" :icon="Delete" size="small" iconOnly
                    tooltip="删除"></Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-10 text-text-secondary">
        <PeoplesTwo theme="outline" size="48" class="mx-auto mb-4 text-gray-400" />
        <p class="mb-4">暂无角色数据</p>
        <Button type="primary" size="small" @click="openDialog()">添加第一个角色</Button>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0 && !listLoading" class="mt-5 flex flex-col md:flex-row justify-between items-center">
        <span class="text-sm text-text-secondary mb-2 md:mb-0">
          共 {{ total }} 条记录，当前第 {{ searchModel.pageNo }} / {{ totalPages }} 页
        </span>
        <div class="flex items-center gap-2">
          <Button type="outline" size="small" :disabled="searchModel.pageNo <= 1"
            @click="goToPage(searchModel.pageNo - 1)">
            上一页
          </Button>
          <!-- Page numbers could be added here for more complex pagination -->
          <Button type="outline" size="small" :disabled="searchModel.pageNo >= totalPages"
            @click="goToPage(searchModel.pageNo + 1)">
            下一页
          </Button>
          <select v-model="searchModel.pageSize" @change="getRoleList"
            class="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
            <option value="5">5 条/页</option>
            <option value="10">10 条/页</option>
            <option value="20">20 条/页</option>
            <option value="50">50 条/页</option>
          </select>
        </div>
      </div>

    </Card>

    <!-- 角色编辑/新增弹窗 -->
    <Modal v-model="dialogFormVisible" :title="dialogTitle" size="lg" backdropStyle="glass">
      <!-- 保存消息提示 -->
      <div v-if="saveMessage"
        :class="['mb-4 p-3 rounded text-sm', saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
        {{ saveMessage.text }}
      </div>

      <!-- 表单 -->
      <form @submit.prevent="saveRole" class="space-y-4">
        <div>
          <label for="roleName" class="block text-sm font-medium text-text-secondary mb-1">角色名称</label>
          <InputField id="roleName" v-model="roleForm.roleName" placeholder="请输入角色名称 (2-20字符)"
            :error="!!formErrors.roleName" :errorMessage="formErrors.roleName" required />
        </div>
        <div>
          <label for="roleDesc" class="block text-sm font-medium text-text-secondary mb-1">角色描述</label>
          <InputField id="roleDesc" v-model="roleForm.roleDesc" placeholder="请输入角色描述 (2-50字符)" type="textarea" :rows="3"
            :error="!!formErrors.roleDesc" :errorMessage="formErrors.roleDesc" required />
          <p v-if="formErrors.roleDesc" class="mt-1 text-xs text-red-600">{{ formErrors.roleDesc }}</p>
          <!-- Show textarea error below -->
        </div>

        <!-- 权限树 -->
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">权限设置</label>
          <div class="border rounded p-3 max-h-60 overflow-y-auto">
            <div class="flex justify-between items-center mb-2 pb-2 border-b">
              <span class="text-sm font-medium text-text-primary">选择权限</span>
              <div class="flex items-center gap-3">
                <button type="button" @click="expandAllNodes(menuList)"
                  class="text-xs text-blue-600 hover:underline">全部展开</button>
                <button type="button" @click="collapseAllNodes()"
                  class="text-xs text-blue-600 hover:underline">全部折叠</button>
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" :checked="isAllSelectedComputed"
                    @change="selectAllNodes(menuList, !isAllSelectedComputed)"
                    class="mr-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="text-xs">{{ isAllSelectedComputed ? '取消全选' : '全选' }}</span>
                </label>
              </div>
            </div>
            <div v-if="formErrors.menuIdList" class="text-xs text-red-600 mb-2">{{ formErrors.menuIdList }}</div>
            <!-- Custom Tree Structure -->
            <div v-for="node in menuList" :key="node.menuId">
              <div class="flex items-center py-1">
                <!-- Toggle Expand/Collapse Icon -->
                <span @click="toggleExpand(node.menuId)" class="cursor-pointer mr-1 w-5 text-center">
                  <component
                    :is="node.children && node.children.length > 0 ? (expandedNodes.has(node.menuId) ? FolderOpen : FolderClose) : 'div'"
                    theme="outline" size="16" class="text-gray-500 hover:text-primary inline-block" />
                </span>
                <!-- Checkbox and Label -->
                <label class="flex items-center cursor-pointer flex-grow">
                  <input type="checkbox" :checked="isNodeSelected(node.menuId)" @change="toggleNodeSelection(node)"
                    class="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="text-sm">{{ node.title }}</span>
                </label>
              </div>
              <!-- Children Nodes -->
              <div v-if="node.children && node.children.length > 0 && expandedNodes.has(node.menuId)" class="pl-6">
                <div v-for="child in node.children" :key="child.menuId">
                  <div class="flex items-center py-1">
                    <span class="mr-1 w-5 text-center"> <!-- Placeholder for alignment -->
                      <component
                        :is="child.children && child.children.length > 0 ? (expandedNodes.has(child.menuId) ? FolderOpen : FolderClose) : 'div'"
                        theme="outline" size="16" class="text-gray-500 hover:text-primary inline-block" />
                    </span>
                    <label class="flex items-center cursor-pointer flex-grow">
                      <input type="checkbox" :checked="isNodeSelected(child.menuId)"
                        @change="toggleNodeSelection(child)"
                        class="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <span class="text-sm">{{ child.title }}</span>
                    </label>
                  </div>
                  <!-- Grandchildren Nodes (Add more levels if needed) -->
                  <div v-if="child.children && child.children.length > 0 && expandedNodes.has(child.menuId)"
                    class="pl-6">
                    <div v-for="grandchild in child.children" :key="grandchild.menuId">
                      <div class="flex items-center py-1">
                        <span class="mr-1 w-5 text-center"></span> <!-- Placeholder -->
                        <label class="flex items-center cursor-pointer flex-grow">
                          <input type="checkbox" :checked="isNodeSelected(grandchild.menuId)"
                            @change="toggleNodeSelection(grandchild)"
                            class="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                          <span class="text-sm">{{ grandchild.title }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 弹窗底部按钮 -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <Button type="outline" @click="closeDialog">取 消</Button>
          <Button type="primary" nativeType="submit" :loading="saveLoading">确 定</Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from '@/composables/vue-imports';
// --- Type Imports ---
import type { Role } from '@/types/role'; // Import Role type
import type { Menu } from '@/types/menu'; // Import Menu type

// --- API Service Imports ---
import roleApi from "@/services/roleManage";
import menuApi from "@/services/menuManage";

// --- Custom Base Component Imports ---
import Button from '@/components/base/Button.vue';
import Card from '@/components/base/Card.vue';
import InputField from '@/components/base/InputField.vue';
import Modal from '@/components/base/Modal.vue';
// Assuming SearchField might not be needed if InputField with icon covers it
// import SearchField from '@/components/base/SearchField.vue';

// --- Icon Imports ---
import { Search, Refresh, Plus, Edit, Delete, PeoplesTwo, FolderClose, FolderOpen } from '@icon-park/vue-next';

// --- Reactive State ---
const searchModel = reactive({
  roleName: '',
  pageNo: 1,
  pageSize: 10, // Default page size
});

const listLoading = ref(false);
const roleList = ref<Role[]>([]);
const total = ref(0);

const dialogFormVisible = ref(false);
const saveLoading = ref(false);
const isEditMode = ref(false);
// Initialize roleForm with correct types and default values
const roleForm = reactive<Partial<Role>>({
  roleId: undefined,
  roleName: '',
  roleDesc: '',
  menuIdList: [], // Initialize as empty array
});
const formErrors = reactive<Record<keyof Omit<Role, 'roleId'> | 'menuIdList', string>>({
  roleName: '',
  roleDesc: '',
  menuIdList: '',
});
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

const menuList = ref<Menu[]>([]); // Use Menu[] directly for the tree data
const expandedNodes = reactive<Set<number>>(new Set()); // Track expanded nodes in custom tree

// --- Computed Properties ---
const dialogTitle = computed(() => (isEditMode.value ? '编辑角色' : '新增角色'));
const totalPages = computed(() => Math.ceil(total.value / searchModel.pageSize));

// --- Validation Logic ---
const validateForm = (): boolean => {
  clearFormErrors(); // Clear previous errors
  let isValid = true;

  if (!roleForm.roleName || roleForm.roleName.trim().length < 2 || roleForm.roleName.trim().length > 20) {
    formErrors.roleName = '角色名称长度需在 2 到 20 个字符';
    isValid = false;
  }
  if (!roleForm.roleDesc || roleForm.roleDesc.trim().length < 2 || roleForm.roleDesc.trim().length > 50) {
    formErrors.roleDesc = '角色描述长度需在 2 到 50 个字符';
    isValid = false;
  }
  // Ensure menuIdList is initialized before checking length
  if (!roleForm.menuIdList || roleForm.menuIdList.length === 0) {
    formErrors.menuIdList = '请至少选择一个权限';
    isValid = false;
  }
  return isValid;
};

const clearFormErrors = () => {
  formErrors.roleName = '';
  formErrors.roleDesc = '';
  formErrors.menuIdList = '';
  saveMessage.value = null; // Also clear save message
};

// --- Methods ---
const getRoleList = async () => {
  listLoading.value = true;
  saveMessage.value = null;
  try {
    // roleApi.getRoleList() 返回的已经是 { rows, total } 对象 (拦截器处理后)
    const roleDataPayload = await roleApi.getRoleList(searchModel);

    // 直接检查 roleDataPayload 的属性
    if (roleDataPayload && typeof roleDataPayload === 'object' &&
        'rows' in roleDataPayload && Array.isArray(roleDataPayload.rows) &&
        'total' in roleDataPayload && typeof roleDataPayload.total === 'number') {
      roleList.value = roleDataPayload.rows as Role[];
      total.value = roleDataPayload.total as number;
    } else {
      console.error("Unexpected response structure from getRoleList (expected {rows, total}):", roleDataPayload);
      roleList.value = [];
      total.value = 0;
      saveMessage.value = { type: 'error', text: '获取角色列表失败: 响应格式错误' };
    }
  } catch (error) {
    console.error("Error fetching role list:", error);
    roleList.value = [];
    total.value = 0;
    saveMessage.value = { type: 'error', text: `获取角色列表失败: ${error instanceof Error ? error.message : '未知错误'}` };
  } finally {
    listLoading.value = false;
  }
};

const getMenuList = async () => {
  try {
    // menuApi.getAllMenus() 现在应该直接返回 Menu[] (如果API直接返回数组)
    const menuArray = await menuApi.getAllMenus();

    // 直接检查 menuArray 是否是一个数组
    if (menuArray && Array.isArray(menuArray)) {
      menuList.value = menuArray;
      // Automatically expand all nodes initially for better UX
      expandAllNodes(menuList.value);
    } else {
      menuList.value = [];
      console.error("Invalid response structure from getAllMenus (expected array):", menuArray);
      saveMessage.value = { type: 'error', text: '获取权限菜单失败: 无效响应' };
    }
  } catch (error) {
    console.error("Error fetching menu list:", error);
    menuList.value = [];
    saveMessage.value = { type: 'error', text: `获取权限菜单失败: ${error instanceof Error ? error.message : '未知错误'}` };
  }
};

const resetSearch = () => {
  searchModel.roleName = '';
  searchModel.pageNo = 1;
  getRoleList(); // Refetch with default params
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    searchModel.pageNo = page;
    getRoleList();
  }
};

const openDialog = async (id?: number) => {
  clearFormErrors();
  saveMessage.value = null;
  await getMenuList();

  if (id) {
    isEditMode.value = true;
    try {
      // roleApi.getRoleById(id) 返回的已经是 Role 对象 (拦截器处理后)
      const roleData = await roleApi.getRoleById(id);

      // 直接检查 roleData 的属性
      if (roleData && typeof roleData === 'object' && 'roleId' in roleData) {
        Object.assign(roleForm, {
          ...roleData,
          menuIdList: Array.isArray(roleData.menuIdList) ? roleData.menuIdList : []
        });
      } else {
        console.error("Invalid data received for role (expected Role object):", roleData);
        throw new Error("获取的角色数据格式无效");
      }
    } catch (error) {
      console.error("Error fetching role by ID:", error);
      saveMessage.value = { type: 'error', text: `获取角色信息失败: ${error instanceof Error ? error.message : '未知错误'}` };
      closeDialog();
      return;
    }
  } else {
    isEditMode.value = false;
    Object.assign(roleForm, {
      roleId: undefined,
      roleName: '',
      roleDesc: '',
      menuIdList: [],
    });
  }
  dialogFormVisible.value = true;
};

const closeDialog = () => {
  dialogFormVisible.value = false;
  // No need to clear form here as openDialog handles reset/population
};

const saveRole = async () => {
  if (!validateForm()) {
    return;
  }

  saveLoading.value = true;
  saveMessage.value = null; // Clear previous messages

  // Make sure menuIdList is assigned correctly before saving
  // getSelectedMenuIds might not be needed if roleForm.menuIdList is directly bound
  // const selectedIds = getSelectedMenuIds(menuList.value);
  // roleForm.menuIdList = selectedIds;

  try {
    if (isEditMode.value && roleForm.roleId) {
      // Ensure roleForm is cast to Role for update, requires roleId
      await roleApi.updateRole(roleForm as Role);
      saveMessage.value = { type: 'success', text: '角色更新成功' };
    } else {
      // Ensure roleId is omitted for add operation
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { roleId, ...addData } = roleForm;
      // Explicitly cast addData to the required type for addRole
      await roleApi.addRole(addData as Omit<Role, 'roleId'>);
      saveMessage.value = { type: 'success', text: '角色添加成功' };
    }

    closeDialog();
    await getRoleList(); // Refresh the list

  } catch (error) {
    console.error("Save role error:", error);
    saveMessage.value = { type: 'error', text: `操作失败: ${error instanceof Error ? error.message : '未知错误'}` };
  } finally {
    saveLoading.value = false;
  }
};


const deleteRole = async (role: Role) => {
  // Use a more modern confirmation dialog if available, otherwise window.confirm
  if (window.confirm(`您确定要删除角色【${role.roleName}】吗？此操作不可撤销。`)) {
    listLoading.value = true; // Indicate loading state on the list
    saveMessage.value = null;
    try {
      await roleApi.deleteRole(role.roleId);
      saveMessage.value = { type: 'success', text: `角色【${role.roleName}】已删除` };

      // Adjust page number if the last item on a page is deleted
      if (roleList.value.length === 1 && searchModel.pageNo > 1) {
        searchModel.pageNo--;
      }
      await getRoleList(); // Refresh list

    } catch (error) {
      console.error("Delete role error:", error);
      saveMessage.value = { type: 'error', text: `删除角色时出错: ${error instanceof Error ? error.message : '未知错误'}` };
      listLoading.value = false; // Ensure loading is turned off on error
    }
    // No finally block needed here as getRoleList sets listLoading to false
  }
};

// --- Custom Tree Logic ---
const isNodeSelected = (nodeId: number): boolean => {
  return roleForm.menuIdList?.includes(nodeId) ?? false;
};

const toggleNodeSelection = (node: Menu) => {
  // Ensure menuIdList is always an array
  const list = Array.isArray(roleForm.menuIdList) ? [...roleForm.menuIdList] : [];
  const index = list.indexOf(node.menuId);

  if (index > -1) {
    list.splice(index, 1); // Deselect
  } else {
    list.push(node.menuId); // Select
  }
  roleForm.menuIdList = list;

  // Optional: Add logic to auto-select/deselect children/parents if needed
  // handleChildSelection(node, index === -1);
  // handleParentSelection(node);
};

// Helper to recursively get all descendant IDs (including self)
/* // Remove unused function
const getAllDescendantIds = (node: Menu): number[] => {
    let ids = [node.menuId];
    if (node.children) {
        node.children.forEach((child: Menu) => {
            ids = ids.concat(getAllDescendantIds(child));
        });
    }
    return ids;
};
*/

// Optional: Handle parent selection based on children state (more complex)
/* // Remove unused function
const handleParentSelection = (node: Menu) => { ... }
*/

const toggleExpand = (nodeId: number) => {
  if (expandedNodes.has(nodeId)) {
    expandedNodes.delete(nodeId);
  } else {
    expandedNodes.add(nodeId);
  }
};

const expandAllNodes = (nodes: Menu[]) => {
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      expandedNodes.add(node.menuId);
      expandAllNodes(node.children); // Recurse
    }
  });
};

const collapseAllNodes = () => {
  expandedNodes.clear();
};

const selectAllNodes = (nodes: Menu[], select: boolean) => {
  const allIds = getAllMenuIds(nodes);
  if (select) {
    // Select all available menu IDs
    roleForm.menuIdList = [...allIds];
  } else {
    // Deselect all, clear the list
    roleForm.menuIdList = [];
  }
};

// Computed property for the master checkbox state
const isAllSelectedComputed = computed(() => {
  const allAvailableIds = getAllMenuIds(menuList.value);
  const currentSelectedIds = roleForm.menuIdList || [];
  // Check if all available IDs are present in the selected list
  return allAvailableIds.length > 0 && allAvailableIds.every(id => currentSelectedIds.includes(id));
});


const getAllMenuIds = (nodes: Menu[]): number[] => {
  let ids: number[] = [];
  nodes.forEach(node => {
    ids.push(node.menuId);
    if (node.children && node.children.length > 0) {
      ids = ids.concat(getAllMenuIds(node.children)); // Recurse
    }
  });
  return ids;
};

// --- Lifecycle Hooks ---
onMounted(() => {
  getRoleList(); // Fetch initial role list on component mount
  // getMenuList(); // Fetch menu list once on mount? Or fetch when dialog opens? Fetching in openDialog is better for freshness.
});

</script>

<style scoped>
/* Add any specific scoped styles if needed, Tailwind handles most styling */
.role-manage-container :deep(textarea) {
  min-height: 80px;
  /* Ensure textarea has a decent default height */
}
</style>
