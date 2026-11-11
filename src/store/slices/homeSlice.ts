import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomeState {
  announcementDismissed: boolean;
  activePromoIndex: number;
  newsletterSubscribedEmail: string | null;
}

const initialState: HomeState = {
  announcementDismissed: false,
  activePromoIndex: 0,
  newsletterSubscribedEmail: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    dismissAnnouncement(state) {
      state.announcementDismissed = true;
    },
    setActivePromoIndex(state, action: PayloadAction<number>) {
      state.activePromoIndex = action.payload;
    },
    setNewsletterSubscribed(state, action: PayloadAction<string | null>) {
      state.newsletterSubscribedEmail = action.payload;
    },
  },
});

export const { dismissAnnouncement, setActivePromoIndex, setNewsletterSubscribed } = homeSlice.actions;
export default homeSlice.reducer;
