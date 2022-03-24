import { Key } from "react";
import { MouseEventHandler } from "react";

export interface CoffeeStore {
  id: Key;
  name: string;
  imgUrl: string;
  websiteUrl: string;
  address: string;
  neighbourhood: string;
}

export interface StaticHomeProps {
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