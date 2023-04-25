/*
 * @Author: szg
 * @Date: 2023-04-22 18:57:18
 * @LastEditors: szg
 * @LastEditTime: 2023-04-25 14:58:39
 * @FilePath: \bill-font\src\api\bill.js
 */
import request from '@/utils/request'

export function getBillList (parameter) {
  return request({
    url: '/bill',
    method: 'get',
    params: parameter
  })
}

export function createBill (data) {
  return request({
    url: '/bill',
    method: 'post',
    data
  })
}

export function getCategoryList () {
  return request({
    url: '/category',
    method: 'get'
  })
}

export function getCountList (parameter) {
  return request({
    url: '/bill/count',
    method: 'get',
    params: parameter
  })
}
