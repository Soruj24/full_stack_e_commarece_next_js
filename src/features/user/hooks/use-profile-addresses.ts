"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { IAddress, IPaymentMethod } from '@/lib/types';
import {
  updateAddresses as serviceUpdateAddresses,
  updatePaymentMethods as serviceUpdatePaymentMethods,
} from "@/features/user/services/profile-service";

export function useProfileAddresses(onLoadingChange?: (v: boolean) => void) {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

  const handleUpdateAddresses = useCallback(
    async (newAddresses: IAddress[]) => {
      onLoadingChange?.(true);
      try {
        const data = await serviceUpdateAddresses(newAddresses);
        setAddresses(data.user.addresses);
        toast.success("Addresses updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        onLoadingChange?.(false);
      }
    },
    [onLoadingChange]
  );

  const handleUpdatePaymentMethods = useCallback(
    async (newMethods: IPaymentMethod[]) => {
      onLoadingChange?.(true);
      try {
        const data = await serviceUpdatePaymentMethods(newMethods);
        setPaymentMethods(data.user.paymentMethods);
        toast.success("Payment methods updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        onLoadingChange?.(false);
      }
    },
    [onLoadingChange]
  );

  return {
    addresses, setAddresses,
    paymentMethods, setPaymentMethods,
    handleUpdateAddresses,
    handleUpdatePaymentMethods,
  };
}
