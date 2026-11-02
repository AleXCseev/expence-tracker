export class UpdateCategoryCommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly changes: { name?: string; color?: string; icon?: string },
  ) {}
}
