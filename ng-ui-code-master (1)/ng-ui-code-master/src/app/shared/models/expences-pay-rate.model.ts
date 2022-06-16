export class ExpancesPayRate {
  "employeeExpenseDetailsId": number;
  "expenseName":string
  "expenseDate":string
  "employeeDetailsId":number
  "totalAmount":number
  "employeeName":string
  "status":string
  "expenseLineItems":ExpancesPayRateItemList[]
}
export class ExpancesPayRateItemList{
  "employeeExpenseLineItemDetailsId":number
  "amount":number 
  "description":string
  "descriptionType":any
  "status":string='1'
  "employeeExpenseDetailsId":number
}

