const en = {
  // base fields translation from father class
  base: {
    id: 'Id',
    state: 'State',
    state_option_0: 'Enable',
    state_option_1: 'Locking',
    state_option_2: 'Disable',
    remark: 'Remark',
    deleted: 'deleted',
    deleted_option_0: 'No',
    deleted_option_1: 'Yes',
    created_by: 'Create User',
    created_time: 'Create Time',
    last_modified_by: 'Update User',
    last_modified_time: 'Update Time'
  },
  bill: {
    'table_name': 'Bill',
    'customer_id': 'Customer Id',
    'bill_date': 'Bill Date',
    'account_no': 'Account No',
    'estimated_electricity': 'Estimated Electricity',
    'district_id': 'District Id',
    'contact': 'Contact'
  },
  contract: {
    'table_name': 'Contract',
    'contract_no': 'Contract No',
    'contract_name': 'Contract Name',
    'person_id': 'Person Id',
    'person_name': 'Person Name',
    'customer_id': 'Customer Id',
    'customer_name': 'Customer Name',
    'start_date': 'Start Date',
    'end_date': 'End Date',
    'voltage': 'Voltage',
    'electricity': 'Electricity',
    'price': 'Price',
    'amount': 'Amount',
    'include_tax': 'Include Tax',
    'cycle': 'Cycle',
    'sign_date': 'Sign Date',
    'model': 'Model',
    'divide': 'Divide',
    'resource': 'Resource',
    'contract_file': 'Contract File',
    'month1': 'Month1',
    'month2': 'Month2',
    'month3': 'Month3',
    'month4': 'Month4',
    'month5': 'Month5',
    'month6': 'Month6',
    'month7': 'Month7',
    'month8': 'Month8',
    'month9': 'Month9',
    'month10': 'Month10',
    'month11': 'Month11',
    'month12': 'Month12'
  },
  contract_history: {
    'table_name': 'Contract History',
    'contract_no': 'Contract No',
    'contract_name': 'Contract Name',
    'contract_id': 'Contract Id',
    'start_date': 'Start Date',
    'end_date': 'End Date',
    'voltage': 'Voltage',
    'electricity': 'Electricity',
    'price': 'Price',
    'amount': 'Amount',
    'include_tax': 'Include Tax',
    'cycle': 'Cycle',
    'model': 'Model',
    'divide': 'Divide'
  },
  contract_template: {
    'table_name': 'Contract Template',
    'template_no': 'Template No',
    'template_name': 'Template Name',
    'category': 'Category',
    'template_file': 'Template File'
  },
  customer: {
    'table_name': 'Customer',
    'login_name': 'Login Name',
    'password': 'Password',
    'customer_name': 'Customer Name',
    'unified_code': 'Unified Code',
    'address': 'Address',
    'legal_representative': 'Legal Representative',
    'legal_phone': 'Legal Phone'
  },
  price_standard: {
    'table_name': 'Price Standard',
    'standard_date': 'Standard Date',
    'tad_price': 'Tad Price',
    'gov_fund': 'Gov Fund',
    'monthly_price': 'Monthly Price',
    'line_loss': 'Line Loss',
    'act_price': 'Act Price',
    'category_price': 'Category Price',
    'gross_price': 'Gross Price',
    'savings': 'Savings',
    'savings_ratio': 'Savings Ratio'
  },
  promise_price: {
    'table_name': 'Promise Price',
    'contract_id': 'Contract Id',
    'month_id': 'Month Id',
    'price': 'Price'
  },
  dict: {
    'table_name': 'Dict',
    'category': 'Category',
    'code': 'Code',
    'i18n': 'I18n',
    'parent_id': 'Parent Id',
    'value': 'Value',
    'sort': 'Sort'
  },
  menu: {
    'table_name': 'Menu',
    'menu_name': 'Menu Name',
    'menu_desc': 'Menu Desc',
    'parent_id': 'Parent Id'
  },
  menu_permission: {
    'table_name': 'Menu Permission',
    'menu_id': 'Menu Id',
    'permission_id': 'Permission Id'
  },
  org: {
    'table_name': 'Org',
    'org_name': 'Org Name',
    'parent_id': 'Parent Id',
    'level': 'Level'
  },
  org_user: {
    'table_name': 'Org User',
    'org_id': 'Org Id',
    'user_id': 'User Id'
  },
  permission: {
    'table_name': 'Permission',
    'permission_name': 'Permission Name',
    'permission_type': 'Permission Type',
    'http_method': 'Http Method',
    'permission_api': 'Permission Api',
    'permission_url': 'Permission Url'
  },
  resource: {
    'table_name': 'Resource',
    'resource': 'Resource',
    'resource_type': 'Resource Type'
  },
  role: {
    'table_name': 'Role',
    'role_code': 'Role Code',
    'role_name': 'Role Name'
  },
  role_permission: {
    'table_name': 'Role Permission',
    'permission_id': 'Permission Id',
    'role_id': 'Role Id'
  },
  sys_log: {
    'table_name': 'Sys Log',
    'id': 'Id',
    'log_type': 'Log Type',
    'request_userid': 'Request Userid',
    'request_time': 'Request Time',
    'request_ip': 'Request Ip',
    'request_uri': 'Request Uri',
    'request_method': 'Request Method',
    'class_name': 'Class Name',
    'class_method': 'Class Method',
    'start_time': 'Start Time',
    'end_time': 'End Time',
    'cost': 'Cost'
  },
  user: {
    'table_name': 'User',
    'login_name': 'Login Name',
    'username': 'Username',
    'password': 'Password',
    'phone': 'Phone',
    'email': 'Email',
    'address': 'Address',
    'wx_open_id': 'Wx Open Id'
  },
  user_role: {
    'table_name': 'User Role',
    'role_id': 'Role Id',
    'user_id': 'User Id'
  },
  person: {
    'table_name': 'Person',
    'login_name': 'Login Name',
    'password': 'Password',
    'name': 'Name',
    'idcard': 'Idcard',
    'phone': 'Phone',
    'address': 'Address',
    'email': 'Email',
    'parent_id': 'Parent Id',
    'level': 'Level'
  }
}

export default en
