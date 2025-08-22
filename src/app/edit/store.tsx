"use client";

import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { useStore } from "zustand";
import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation";
import { last } from "lodash-es";

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace EditPage {
  export interface SessionItem {
    id: string;
    title: string;
    createdAt: number;
    thumb: string;
  }

  export interface EditAsset {
    sessionId: string;
    assetId: string;
    prompt: string;
    createdAt: number;
    pic?: string
  }

  export interface EditOprationItem {
    sessionId: string;
    oprationId: string;
    parentPic: string;
    prompt: string;
    genTotal: number;
    createdAt: number;
    output: EditAsset[];
  }

  export interface EditOpration {
    sessionId: string;
    list: EditOprationItem[];
  }

  export type StoreState = {
    sessionList: SessionItem[];
    oprations: Record<string, EditOprationItem[]>; // key: sessionId
    currentAsset?: CurrentAsset,
  };

  export type CurrentAsset = {
      oprationId?: string
      assetId?: string
      pic: string
    }

  export type StoreAction = {
    addSession: (item: SessionItem) => void;
    deleteSession: (id: string) => void;
    generateImage: (
      sessionId: string,
      prompt: string,
      genTotal?: number,
      option?: { parentPic: string, prefix?: string, currentPic?: string, assetId?: string }
    ) => EditOprationItem;
    setCurrentAsset: (asset: CurrentAsset) => void;
    clearCurrentAsset: () => void;
  };

  export type Store = StoreState & StoreAction;
}

export const defaultInitState: EditPage.StoreState = {
  sessionList: [],
  oprations: {},
};

const createEditPageStore = (
  initState: EditPage.StoreState = defaultInitState
) => {
  return createStore<EditPage.Store>()(
    persist(
      (set, get) => ({
        ...initState,
        addSession: (item: EditPage.SessionItem) => {
          return set({
            sessionList: get().sessionList.concat([item]),
            currentAsset: undefined
          });
        },
        deleteSession: (id: string) => {
          return set({
            sessionList: get().sessionList.filter((item) => item.id !== id),
            currentAsset: undefined
          });
        },
        generateImage: (
          sessionId,
          prompt,
          genTotal = 1,
          { parentPic, currentPic, assetId } = { parentPic: "", currentPic: '' }
        ) => {
          const oprationId = nanoid(10);

          const oprItem: EditPage.EditOprationItem = {
            sessionId,
            oprationId,
            parentPic,
            prompt,
            genTotal,
            createdAt: Date.now(),
            output: new Array(genTotal).fill(0).map((_, idx) => ({
              sessionId,
              assetId: (idx === 0 ? assetId : undefined) || nanoid(10),
              prompt: `${idx}: ${prompt}`,
              createdAt: Date.now(),
              pic: currentPic
            })),
          };

          const allOperations = get().oprations
          const sessionOperations = allOperations[sessionId] || []

          const lastOutput = last(oprItem.output)

          set({
            oprations: {
              ...allOperations,
              [sessionId]: [oprItem].concat(sessionOperations)
            },
            currentAsset: {
              assetId: lastOutput?.assetId || '',
              pic: currentPic || editPageHelpers.getOgUrl('Krea/Edit', lastOutput?.prompt || '-', lastOutput?.assetId)
            }
          });

          return oprItem
        },
        setCurrentAsset: (asset) => {
          set({
            currentAsset: asset,
          })
        },
        clearCurrentAsset: () => {
          set({
            currentAsset: undefined
          });
        }
      }),
      {
        name: "edit-page-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
};

export type EditPageStoreApi = ReturnType<typeof createEditPageStore>;

export const EditPageStoreContext = createContext<EditPageStoreApi | undefined>(
  undefined
);

export const EditPageStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<EditPageStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createEditPageStore();
  }

  return (
    <EditPageStoreContext.Provider value={storeRef.current}>
      {children}
    </EditPageStoreContext.Provider>
  );
};

export const useEditPageStore = <T,>(
  selector: (store: EditPage.Store) => T
): T => {
  const storeContext = useContext(EditPageStoreContext);

  if (!storeContext) {
    throw new Error(
      `useEditPageStore must be used within EditPageStoreProvider`
    );
  }

  return useStore(storeContext, selector);
};

export const useSessionOprs = (sessionId: string) => {
  const oprations = useEditPageStore(s => s.oprations)
  const list = oprations[sessionId]

  return list
}

export const useActiveSession = () => {
  const sessionList = useEditPageStore(s => s.sessionList)
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  return sessionList.find(item => item.id === projectId)
}

export const useActiveAsset = (): EditPage.CurrentAsset => {
  const activeSession = useActiveSession()
  const currentAsset = useEditPageStore(s => s.currentAsset)

  if (currentAsset) {
    return currentAsset
  }

  return {
    pic: activeSession?.thumb || ''
  }
}

export const editPageHelpers = {
  getOgUrl: (title: string, desc: string, id?: string) => {
    const thumbParams = new URLSearchParams({
      title: encodeURIComponent(title),
      subtitle: encodeURIComponent(desc),
      id: id ? encodeURIComponent(id) : '',
    })

    return `/api/og?${thumbParams.toString()}`
  }
}
