import { useMedia } from "react-use";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) => {
  // TODO: Maybe change 1024px to 600px for better looking in the future
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}>
        <DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
          {children}
        </DialogContent>
      </Dialog>
    );
  } else if (!isDesktop) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="hide-scrollbar max-h-[85vh] w-full overflow-hidden border-none p-0">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
};
