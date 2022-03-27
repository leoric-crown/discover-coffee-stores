import { Key } from "react";
import { MouseEventHandler } from "react";

export interface CoffeeStore {
  id: Key;
  name: string;
  imgUrl: ImgUrl;
  websiteUrl: string;
  address: string;
  neighbourhood: string;
  votes: number;
  static: boolean;
}

export interface ImgUrl {
  prefix: string;
  suffix: string;
  width: number;
  height: number;
}

export interface HomeProps {
  staticCoffeeStores: CoffeeStore[];
}

export interface BannerProps {
  handleOnClick: MouseEventHandler;
  buttonText: string;
  disableButton: boolean;
}

export interface CardProps {
  name: string;
  imgUrl: string;
  href: string;
}

export interface CoffeeStorePageProps {
  coffeeStore: CoffeeStore;
}