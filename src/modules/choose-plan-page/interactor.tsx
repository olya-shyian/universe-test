import BooleanValue from "../../enums/BooleanValue";
import PageLinks from "../../enums/PageLinks";
import QuerySourceEnum from "../../enums/QuerySourceEnum";
import IPaymentPageInteractor, {
  Plan,
} from "../../interfaces/IPaymentPageInteractor";
import { useRemoteConfig } from "../../providers/remote-config-provider";
import { useUser } from "../../providers/user-provider";
import { API } from "../../services/api";
import { PaymentPlanId } from "../../use-cases/get-subscription-products";
import {
  MONTHLY_PLAN_NAME as monthlyPlanName,
  MONTHLY_FULL_PLAN_NAME as monthlyFullPlanName,
  ANNUAL_PLAN_NAME as annualPlanName,
  MONTHLY_PLAN_BULLETS as monthlyPlanBullets,
  MONTHLY_FULL_PLAN_BULLETS as monthlyFullPlanBullets,
  ANNUAL_PLAN_BULLETS as annualPlanBullets,
} from "./consts/interactorConsts";
import { useFile } from "./hooks/useFile";
import { useLoadImageCover } from "./hooks/useLoadImageCover";
import { useLoadPdfCover } from "./hooks/useLoadPdfCover";
import { usePaymentPlans } from "./hooks/usePaymentPlans";
import {
  generateBullet,
  getAnnualFormattedPrice,
  getCurrency,
  getTrialFormattedPrice,
} from "./utils/interactorUtils";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const usePaymentPageInteractor = (): IPaymentPageInteractor => {
  const router = useRouter();
  const { query, push, back } = router;

  const {
    user: { email, subscription },
  } = useUser();
  const file = useFile(query);
  const { abTests, isRemoteConfigLoading } = useRemoteConfig();
  const { products, selectedPlan, onSelectPlan, onContinue } = usePaymentPlans(
    router,
    abTests
  );
  const { isImageLoading, imagePDF } = useLoadPdfCover(file, query);
  const fileLink = useLoadImageCover(file, query);

  useEffect(() => {
    if (subscription) {
      push(`${PageLinks.Dashboard}`);
    }

    if (!email) {
      back();

      return;
    }

    if (query?.token) {
      API.auth.byEmailToken(query.token as string);
    }
  }, [subscription, email, query?.token]);

  // @NOTE: analytics on page rendered
  useEffect(() => {
    localStorage.setItem("select_plan_view", BooleanValue.True);

    return () => {
      localStorage.removeItem("select_plan_view");
    };
  }, []);

  const getPlans = (t: (key: string) => string): Plan[] => {
    const [monthlyProduct, monthlyFullProduct, annualProduct] = products;

    return [
      {
        id: monthlyProduct?.name as PaymentPlanId,
        title: t(`${monthlyPlanName}.title`),
        price: getTrialFormattedPrice(
          monthlyProduct?.price!.trial_price!,
          monthlyProduct?.price!.currency
        ),
        fullPrice: getTrialFormattedPrice(
          monthlyProduct?.price?.price,
          monthlyProduct?.price?.currency
        ),
        formattedCurrency: getCurrency(monthlyProduct?.price.currency),
        date: null,
        bullets: monthlyPlanBullets.map(({ isChecked, style }, index) =>
          generateBullet(isChecked, monthlyPlanName, index + 1, style, t)
        ),
        text: t(`${monthlyPlanName}.text`),
      },
      {
        id: monthlyFullProduct?.name as PaymentPlanId,
        title: t(`${monthlyFullPlanName}.title`),
        price: getTrialFormattedPrice(
          monthlyFullProduct?.price?.trial_price!,
          monthlyFullProduct?.price?.currency
        ),
        fullPrice: getTrialFormattedPrice(
          monthlyFullProduct?.price?.price,
          monthlyFullProduct?.price?.currency
        ),
        formattedCurrency: getCurrency(monthlyFullProduct?.price.currency),
        date: null,
        bullets: monthlyFullPlanBullets.map(({ isChecked, style }, index) =>
          generateBullet(isChecked, monthlyFullPlanName, index + 1, style, t)
        ),
        text: t(`${monthlyFullPlanName}.text`),
      },
      {
        id: annualProduct?.name as PaymentPlanId,
        title: t(`${annualPlanName}.title`),
        price: getAnnualFormattedPrice(
          annualProduct?.price?.price,
          annualProduct?.price?.currency
        ),
        date: t(`${annualPlanName}.date`),
        bullets: annualPlanBullets.map(({ isChecked, style }, index) =>
          generateBullet(isChecked, annualPlanName, index + 1, style, t)
        ),
        text: t(`${annualPlanName}.text`),
      },
    ];
  };

  return {
    selectedPlan,
    onSelectPlan,
    onContinue,

    imagePDF: imagePDF ?? null,
    isImageLoading,
    fileName: file?.filename ?? null,
    fileType: file?.internal_type ?? null,
    fileLink,
    isEditorFlow:
      (query?.source === QuerySourceEnum.Editor ||
        query?.source === QuerySourceEnum.Account) &&
      !query?.convertedFrom,
    isSecondEmail: query?.fromEmail === BooleanValue.True,
    isThirdEmail: query?.fromEmail === BooleanValue.True,

    isRemoteConfigLoading,

    getPlans,
    isPlansLoading: !products.length,
  };
};
