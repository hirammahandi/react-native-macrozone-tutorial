import { colors, spacing } from "@/shared/styles/global";
import { BlurTargetView, BlurView } from "expo-blur";
import { cloneElement, createContext, isValidElement, useContext, useEffect, useId, useMemo, useRef, useState, type ComponentRef, type ReactElement, type ReactNode, type RefObject } from "react";
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

type DialogPortal = {
  setNode: (id: string, node: ReactNode | null) => void;
};

type BlurTargetRef = RefObject<ComponentRef<typeof View> | null>;

const DialogPortalContext = createContext<DialogPortal | null>(null);
const DialogBlurTargetContext = createContext<BlurTargetRef | null>(null);

/**
 * Wraps the screen that dialogs should blur. The overlay is rendered next to
 * this target, which is what Android requires: a `BlurView` can only blur a
 * `BlurTargetView` in the same window, so it cannot live inside a `Modal`.
 * Place it once, around the navigator, in the root layout.
 */
export const DialogBlurTarget = ({ children }: { children: ReactNode }) => {
  const targetRef = useRef<ComponentRef<typeof View> | null>(null);
  const [nodes, setNodes] = useState<{ id: string; node: ReactNode }[]>([]);

  const portal = useMemo<DialogPortal>(
    () => ({
      setNode: (id, node) => {
        setNodes((current) => {
          if (node === null) {
            return current.some((entry) => entry.id === id) ? current.filter((entry) => entry.id !== id) : current;
          }
          return current.some((entry) => entry.id === id) ? current : [...current, { id, node }];
        });
      },
    }),
    [],
  );

  return (
    <DialogPortalContext value={portal}>
      <DialogBlurTargetContext value={targetRef}>
        <View style={styles.host}>
          <BlurTargetView ref={targetRef} style={styles.host} collapsable={false}>
            {children}
          </BlurTargetView>
          {nodes.map((entry) => (
            <View key={entry.id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
              {entry.node}
            </View>
          ))}
        </View>
      </DialogBlurTargetContext>
    </DialogPortalContext>
  );
};

const useDialog = () => {
  const value = useContext(DialogContext);
  if (!value) {
    throw new Error("Dialog components must be rendered inside Dialog");
  }
  return value;
};

type PressableChildProps = {
  onPress?: () => void;
  onLongPress?: () => void;
};

type DialogProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Root of the dialog. Holds the open state and shares it with the pieces below.
 *
 * Dialog
 * ├── DialogTrigger
 * └── DialogContent
 *     ├── DialogHeader
 *     │   ├── DialogTitle
 *     │   └── DialogDescription
 *     └── DialogFooter
 *         └── DialogClose
 */
export const Dialog = ({ children, open: openProp, defaultOpen = false, onOpenChange }: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (openProp === undefined) {
      setUncontrolledOpen(next);
    }
  };

  return <DialogContext value={{ open, setOpen }}>{children}</DialogContext>;
};

type DialogTriggerProps = {
  children: ReactNode;
  /** Which gesture opens the dialog. Defaults to a press. */
  action?: "press" | "longPress";
};

export const DialogTrigger = ({ children, action = "press" }: DialogTriggerProps) => {
  const { setOpen } = useDialog();
  const open = () => setOpen(true);

  if (isValidElement<PressableChildProps>(children)) {
    const props =
      action === "longPress"
        ? {
            onLongPress: () => {
              children.props.onLongPress?.();
              open();
            },
          }
        : {
            onPress: () => {
              children.props.onPress?.();
              open();
            },
          };
    return cloneElement(children as ReactElement<PressableChildProps>, props);
  }

  return (
    <Pressable onPress={action === "press" ? open : undefined} onLongPress={action === "longPress" ? open : undefined}>
      <Text>{children}</Text>
    </Pressable>
  );
};

type DialogContentProps = {
  children: ReactNode;
};

const DialogSurface = ({ children, onClose, targetRef }: { children: ReactNode; onClose: () => void; targetRef: BlurTargetRef | null }) => {
  const androidBlur = Platform.OS === "android" && targetRef ? { blurMethod: "dimezisBlurView" as const, blurTarget: targetRef } : {};

  return (
    <BlurView intensity={40} tint="dark" style={[StyleSheet.absoluteFill, styles.overlay]} {...androidBlur}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Pressable style={styles.content} onPress={() => {}}>
        {children}
      </Pressable>
    </BlurView>
  );
};

export const DialogContent = ({ children }: DialogContentProps) => {
  const { open, setOpen } = useDialog();
  const portal = useContext(DialogPortalContext);
  const targetRef = useContext(DialogBlurTargetContext);
  const id = useId();
  const latest = useRef({ children, setOpen });

  useEffect(() => {
    latest.current = { children, setOpen };
  }, [children, setOpen]);

  useEffect(() => {
    if (!portal) return;
    if (!open) {
      portal.setNode(id, null);
      return;
    }

    portal.setNode(
      id,
      <DialogContext value={{ open: true, setOpen: (next) => latest.current.setOpen(next) }}>
        <DialogSurface targetRef={targetRef} onClose={() => latest.current.setOpen(false)}>
          {latest.current.children}
        </DialogSurface>
      </DialogContext>,
    );

    return () => portal.setNode(id, null);
  }, [open, portal, targetRef, id]);

  useEffect(() => {
    if (!open) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      latest.current.setOpen(false);
      return true;
    });
    return () => subscription.remove();
  }, [open]);

  if (portal || !open) return null;

  return (
    <DialogSurface targetRef={null} onClose={() => setOpen(false)}>
      {children}
    </DialogSurface>
  );
};

export const DialogHeader = ({ children }: { children: ReactNode }) => {
  return <View style={styles.header}>{children}</View>;
};

export const DialogTitle = ({ children }: { children: ReactNode }) => {
  return <Text style={styles.title}>{children}</Text>;
};

export const DialogDescription = ({ children }: { children: ReactNode }) => {
  return <Text style={styles.description}>{children}</Text>;
};

export const DialogFooter = ({ children }: { children: ReactNode }) => {
  return <View style={styles.footer}>{children}</View>;
};

/** Closes the dialog when pressed. A single element child keeps its own onPress. */
export const DialogClose = ({ children }: { children: ReactNode }) => {
  const { setOpen } = useDialog();
  const close = () => setOpen(false);

  if (isValidElement<PressableChildProps>(children)) {
    return cloneElement(children as ReactElement<PressableChildProps>, {
      onPress: () => {
        children.props.onPress?.();
        close();
      },
    });
  }

  return (
    <Pressable onPress={close}>
      <Text>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  host: {
    flex: 1,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "86%",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
});
