import request from '@/utils/request'

// 查询字典数据列表
export function listData(query:any) {
    return request({
        url: '/system/dict-data/',
        method: 'get',
        params: query
    })
}

// 查询字典数据详细
export function getData(dictCode: string) {
    return request({
        url: '/system/dict-data/' + dictCode + '/',
        method: 'get'
    })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType: string) {
    return request({
        url: '/system/dict-data/?dict_type=' + dictType,
        method: 'get'
    })
}

// 新增字典数据
export function addData(data: any) {
    return request({
        url: '/system/dict-data/',
        method: 'post',
        data: data
    })
}

// 修改字典数据
export function updateData(data: any) {
    return request({
        url: '/system/dict-data/' + data.id + '/',
        method: 'put',
        data: data
    })
}

// 删除字典数据
export function delData(dictCode: number) {
    return request({
        url: '/system/dict-data/' + dictCode + '/',
        method: 'delete'
    })
}

// 导出字典数据
export function exportData(query: any) {
    return request({
        url: '/system/dict/data/export',
        method: 'get',
        params: query
    })
}
