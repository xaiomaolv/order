/**
 * 以下根据domain包中实体类，ApiModelProperty注解自动生成
 * 修改：请修改对应的注解，使用JSLangBuilder生成
 */
const cn = {
  // 基础翻译，针对那些被继承的属性
  base: {
    id: '序号',
    state: '状态',
    state_option_0: '启用',
    state_option_1: '锁定',
    state_option_2: '停用',
    remark: '备注',
    deleted: '删除',
    deleted_option_0: '否',
    deleted_option_1: '是',
    created_by: '创建人',
    created_time: '创建时间',
    last_modified_by: '更新人',
    last_modified_time: '更新时间'
  },
  bill: {
    'table_name': 'Bill',
    'customer_id': '客户id',
    'bill_date': '电费单日期',
    'account_no': '营销户号',
    'estimated_electricity': '预估电量',
    'district_id': '所在区县',
    'contact': '注册联系人'
  },
  contract: {
    'table_name': '合同',
    'contract_no': '合同编号',
    'contract_name': '合同名称',
    'person_id': '销售id',
    'person_name': '销售名称',
    'customer_id': '客户id',
    'customer_name': '客户名称',
    'start_date': '合同开始日期',
    'end_date': '合同结束日期',
    'voltage': '合同电压',
    'electricity': '合同电量（千瓦时）',
    'price': '合同电价（元/千瓦时）',
    'amount': '合同金额（万元）',
    'include_tax': '是否含税',
    'cycle': '合同周期',
    'sign_date': '签订时间',
    'model': '结算模式',
    'divide': '分成比例',
    'resource': '附件',
    'contract_file': '合同文本',
    'month1': '1月',
    'month2': '2月',
    'month3': '3月',
    'month4': '4月',
    'month5': '5月',
    'month6': '6月',
    'month7': '7月',
    'month8': '8月',
    'month9': '9月',
    'month10': '10月',
    'month11': '11月',
    'month12': '12月'
  },
  contract_history: {
    'table_name': '合同历史',
    'contract_no': '合同编号',
    'contract_name': '合同名称',
    'contract_id': '合同id',
    'start_date': '合同开始日期',
    'end_date': '合同结束日期',
    'voltage': '合同电压',
    'electricity': '合同电量（千瓦时）',
    'price': '合同电价（元/千瓦时）',
    'amount': '合同金额（万元）',
    'include_tax': '是否含税',
    'cycle': '合同周期',
    'model': '结算模式',
    'divide': '分成比例'
  },
  contract_template: {
    'table_name': '合同模板',
    'template_no': '模板编号',
    'template_name': '模板名称',
    'category': '模板类型',
    'template_file': '模板文件'
  },
  customer: {
    'table_name': 'Customer',
    'login_name': '账号',
    'password': '秘密',
    'customer_name': '企业名称',
    'unified_code': '统一代码',
    'address': '详细地址',
    'legal_representative': '法人代表',
    'legal_phone': '法人手机'
  },
  price_standard: {
    'table_name': 'Price Standard',
    'standard_date': '日期',
    'tad_price': '输配电价',
    'gov_fund': '政府基金',
    'monthly_price': '分月报价',
    'line_loss': '线损',
    'act_price': '到户电价',
    'category_price': '目录电价',
    'gross_price': '目录电价（含基金）',
    'savings': '节约费用',
    'savings_ratio': '节约比例'
  },
  promise_price: {
    'table_name': 'Promise Price',
    'contract_id': '合同id',
    'month_id': '月份',
    'price': '电价'
  },
  dict: {
    'table_name': '数据字典',
    'category': '字典类别',
    'code': '字典代码',
    'i18n': '国际化编码',
    'parent_id': '父id',
    'value': '字典值',
    'sort': '排序'
  },
  menu: {
    'table_name': '菜单',
    'menu_name': '菜单名称',
    'menu_desc': '菜单描述',
    'parent_id': '父菜单ID'
  },
  menu_permission: {
    'table_name': 'Menu Permission',
    'menu_id': 'Menu Id',
    'permission_id': 'Permission Id'
  },
  org: {
    'table_name': '机构',
    'org_name': '机构名称',
    'parent_id': '上级机构',
    'level': '层级'
  },
  org_user: {
    'table_name': 'Org User',
    'org_id': 'Org Id',
    'user_id': 'User Id'
  },
  permission: {
    'table_name': 'Permission',
    'permission_name': '名称',
    'permission_type': '类型',
    'http_method': 'http类型',
    'permission_api': '权限Api',
    'permission_url': '资源链接'
  },
  resource: {
    'table_name': 'Resource',
    'resource': 'Resource',
    'resource_type': 'Resource Type'
  },
  role: {
    'table_name': '角色',
    'role_code': '角色代码',
    'role_name': '名称'
  },
  role_permission: {
    'table_name': 'Role Permission',
    'permission_id': 'Permission Id',
    'role_id': 'Role Id'
  },
  sys_log: {
    'table_name': 'Sys Log',
    'id': '主键',
    'log_type': '日志类型',
    'request_userid': '请求用户',
    'request_time': '请求时间',
    'request_ip': '请求ip',
    'request_uri': '请求路径',
    'request_method': '请求方式',
    'class_name': '类名',
    'class_method': '类方法名',
    'start_time': '请求开始时间',
    'end_time': '请求结束时间',
    'cost': '请求耗时毫秒单位'
  },
  user: {
    'table_name': '用户',
    'login_name': '账号',
    'username': '姓名',
    'password': '密码',
    'phone': '电话',
    'email': 'Email',
    'address': '地址',
    'wx_open_id': '微信openid'
  },
  user_role: {
    'table_name': 'User Role',
    'role_id': 'Role Id',
    'user_id': 'User Id'
  },
  person: {
    'table_name': 'Person',
    'login_name': '账号',
    'password': '密码',
    'name': '姓名',
    'code': '验证码',
    'idcard': '身份证号',
    'phone': '手机号',
    'address': '地址',
    'email': '邮箱',
    'parent_id': '父id',
    'level': '层级'
  }
}

export default cn
