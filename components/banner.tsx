import styles from "../styles/banner.module.css";
import { BannerProps } from "../types";

const Banner = (props: BannerProps) => {
  const { handleOnClick, buttonText } = props;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffeeshops!</p>
      <div className={styles.buttonWrapper}>
        <button
          disabled={props.disableButton}
          className={styles.button}
          onClick={handleOnClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
export default Banner;
// import React from "react";
// import { GeolocatedProps, geolocated } from "react-geolocated";
// class Banner extends React.Component<BannerProps & GeolocatedProps> {
//   render() {
//     const { handleOnClick, buttonText } = this.props;
//     return (
//       <div className={styles.container}>
//         <h1 className={styles.title}>
//           <span className={styles.title1}>Coffee</span>
//           <span className={styles.title2}>Connoisseur</span>
//         </h1>
//         <p className={styles.subTitle}>Discover your local coffeeshops!</p>
//         <div className={styles.buttonWrapper}>
//           <button
//             disabled={this.props.disableButton}
//             className={styles.button}
//             onClick={handleOnClick}
//           >
//             {buttonText}
//           </button>
//         </div>
//       </div>
//     );
//   }
// }

// export default geolocated()(Banner)
