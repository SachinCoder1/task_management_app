"use client";

import { Drawer } from "vaul";
import { useEffect } from "react";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};
export default function CustomDrawer({
  isOpen,
  onClose,
  title,
  children,
}: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-l-[10px] mt-24 h-full fixed bottom-0 right-0 w-[350px] outline-none shadow-lg">
          <div className="p-4">
            {/* Drawer Header */}
            <div className="flex justify-between items-center">
              <Drawer.Title className="font-medium mb-2 text-zinc-900">
                {title}
              </Drawer.Title>
              <button
                className="text-gray-600 hover:text-black"
                onClick={onClose}
              >
                ✖
              </button>
            </div>

            {/* Drawer Content */}
            <div className="mt-4">{children}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
