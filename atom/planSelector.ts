import { ISearchDataInfo } from '@/pages/api/api';
import { atom } from 'recoil';

export type DateItem = {
  date: string;
  list: ISearchDataInfo[];
};

export interface DateObject {
  nickname: string;
  region: string;
  title: string;
  plan: DateItem[];
}

export const planListState = atom<DateObject>({
  key: 'planListState',
  default: {
    nickname: '',
    region: '',
    title: '',
    plan: [],
  },
});
