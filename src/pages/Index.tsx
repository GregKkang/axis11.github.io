import logo from "@/assets/axis11-logo.png";
import logoDark from "@/assets/axis11-logo-dark.jpg";
import logoIcon from "@/assets/axis11-icon.png";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-background p-8">
      <h1 className="text-2xl font-semibold tracking-wide text-foreground">Axis11 Capital — Logo Suite</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-muted-foreground">Primary (Light)</p>
          <div className="rounded-lg border border-border bg-card p-6">
            <img src={logo} alt="Axis11 Capital Logo - Light" width={280} height={280} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-muted-foreground">Dark Background</p>
          <div className="overflow-hidden rounded-lg border border-border">
            <img src={logoDark} alt="Axis11 Capital Logo - Dark" width={280} height={280} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-muted-foreground">Icon Only</p>
          <div className="rounded-lg border border-border bg-card p-6">
            <img src={logoIcon} alt="Axis11 Capital Icon" width={280} height={280} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
