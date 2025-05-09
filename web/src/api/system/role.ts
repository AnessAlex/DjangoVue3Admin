import request from '@/utils/request';


// 查询角色列表
export function listRole(query: Array<object>) {
	return request({
		url: '/system/role/',
		method: 'get',
		params: query
	})
}

// 查询角色详细
export function getRole(roleId: number) {
	return request({
		url: '/system/role/' + roleId + '/',
		method: 'get'
	})
}

// 获取角色表里所有的角色
export function getAllRoles() {
	return request({
		url: '/system/role/get-all-roles/',
		method: 'get'
	})
}

// 新增角色
export function addRole(data: Array<object>) {
	return request({
		url: '/system/role/',
		method: 'post',
		data: data
	})
}

// 修改角色
export function updateRole(data: any) {
	return request({
		url: '/system/role/' + data.id + '/',
		method: 'put',
		data: data
	})
}

// 删除角色
export function delRole(roleId: number) {
	return request({
		url: '/system/role/' + roleId + '/',
		method: 'delete'
	})
}
// 导出
export function exportRole(query: any) {
	return request({
		url: '/system/role/export',
		method: 'get',
		params: query
	})
}
