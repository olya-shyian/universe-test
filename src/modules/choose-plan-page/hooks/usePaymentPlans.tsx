import PageLinks from "../../../enums/PageLinks";
import {
  PaymentPlanId,
  useGetSubscriptionProducts,
} from "../../../use-cases/get-subscription-products";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";

export const usePaymentPlans = (router: NextRouter, abTests: {}) => {
  const { products } = useGetSubscriptionProducts();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanId>(
    PaymentPlanId.MONTHLY_FULL
  );

  // @NOTE: setting pre-select plan for users from remarketing emails
  useEffect(() => {
    if (router.query?.fromEmail === "true") {
      setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
    }
  }, [abTests]);

  const onSelectPlan = (plan: PaymentPlanId) => {
    if (selectedPlan === plan) {
      setSelectedPlan(plan);
      onContinue();

      return;
    }

    setSelectedPlan(plan);
  };

  const onContinue = () => {
    localStorage.setItem("selectedPlan", selectedPlan);

    router.push({ pathname: `${PageLinks.Payment}`, query: router.query });
  };

  return {
    products,
    selectedPlan,
    onSelectPlan,
    onContinue,
  };
};
