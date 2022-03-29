import Image from "next/image";
import Link from "next/link";
import cls from "classnames";
import styles from "../styles/card.module.css";
import { CardProps } from "../types";
import React from 'react'

const Card = (props: CardProps) => {
  const { name, imgUrl, href } = props;
  return (
    <Link href={href}>
      <a className={styles.cardLink}>
        <div className={cls("glass",styles.container)}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{name}</h2>
          </div>
          <Image
            className={styles.cardImg}
            src={imgUrl}
            width={1}
            height={1}
            layout="responsive"
            alt={name + "image"}
          />
        </div>
      </a>
    </Link>
  );
};

export default Card;
