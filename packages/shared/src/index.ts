export interface ExpenseDto {
  id: string;
  amount: string;
  description: string | null;
  date: string;
  categoryId: string;
}

export interface CategoryDto {
  id: string;
  name: string;
}
