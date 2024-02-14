import CurrencyEnum from "../../../enums/CurrencyEnum";
import check from "../assets/check.svg";
import cross from "../assets/cross.svg";

export const getTrialFormattedPrice = (price: number, currency: string) => {
  const roundedPrice = (price / 100).toFixed(2);

  if (currency === CurrencyEnum.Usd) {
    return `$${roundedPrice}`;
  }

  if (currency === CurrencyEnum.Gbp) {
    return `£${roundedPrice}`;
  }

  return `€${roundedPrice}`;
};

export const getAnnualFormattedPrice = (price: number, currency: string) => {
  const pricePerMonth = price / 100 / 12;
  const roundedPrice = pricePerMonth.toFixed(2);

  if (price === 19900) {
    return `€${roundedPrice}`;
  }

  if (currency === CurrencyEnum.Usd) {
    return `$${roundedPrice}`;
  }

  if (currency === CurrencyEnum.Gbp) {
    return `£${roundedPrice}`;
  }

  return `€${roundedPrice}`;
};

export const getCurrency = (currency: string) => {
  if (currency === CurrencyEnum.Usd) {
    return "$";
  }

  if (currency === CurrencyEnum.Gbp) {
    return "£";
  }

  return "€";
};

export const generateBullet = (
  isChecked: boolean,
  bullText: string,
  index: number,
  style = "",
  t: (key: string) => string
) => ({
  imgSrc: isChecked ? check : cross,
  bullText: <span className={style}>{t(`${bullText}.bullet${index}`)}</span>,
});
