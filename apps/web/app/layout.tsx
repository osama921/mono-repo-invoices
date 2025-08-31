export const metadata = { title: 'Executive Dashboard' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>{children}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              const tryRender = () => {
                const c = document.getElementById('statusChart');
                if (!c || !window.__chartData) return;
                if (window.__chart) { window.__chart.destroy(); }
                const ctx = c.getContext('2d');
                window.__chart = new window.Chart(ctx, { type: 'doughnut', data: window.__chartData });
              };
              const obs = new MutationObserver(tryRender);
              obs.observe(document.documentElement, { childList:true, subtree:true });
              setInterval(tryRender, 1000);
            })();
          `
        }}
      />
    </body></html>
  );
}
