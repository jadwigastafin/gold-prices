export class Gold {

  constructor(
    private price: number,
    public date: string
  ) { }

  public getPrice() {
    return this.price;
  }

}
