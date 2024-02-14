import { PaymentPlanId } from "../use-cases/get-subscription-products";

export type Bullets = {
  imgSrc: string;
  bullText: JSX.Element;
};

export type Plan = {
  id: PaymentPlanId;
  title: string;
  price: string;
  date: string | null;
  bullets: Bullets[];
  bulletsC?: Bullets[];
  text: string | JSX.Element;
  formattedCurrency?: string;
  fullPrice?: string;
};

export default interface IPaymentPageInteractor {
  selectedPlan: PaymentPlanId;
  onSelectPlan: (plan: PaymentPlanId) => void;
  onContinue: (place?: string) => void;

  imagePDF: Blob | null;
  isImageLoading: boolean;
  fileType: string | null;
  fileLink: string | null;

  isEditorFlow: boolean;
  isSecondEmail: boolean;
  isThirdEmail: boolean;

  isRemoteConfigLoading: boolean;
  fileName: string | null;

  getPlans: (t: (key: string) => string) => Plan[];
  isPlansLoading: boolean;
}
