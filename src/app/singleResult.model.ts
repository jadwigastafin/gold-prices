import { Gold } from './gold.model';

export class SingleResult {

  constructor(
    public maxPrice: Gold,
    public minPrice: Gold,
    public medianValue: number
  ) {}

}
