export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  AddTransaction: undefined;
  Summary: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  TransactionDetail: { id: string };
  EditTransaction: { id: string };
};
