import pandas as pd
import numpy as np
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import warnings
from datetime import datetime
import calendar
from tkinter.font import Font

warnings.filterwarnings('ignore')

class ResponsiveHRDataScienceApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Aplikasi HR Analytics - Responsive Dashboard")
        self.root.geometry("1400x800")
        self.root.minsize(1200, 700)  # Minimum size
        
        # Set window icon (optional)
        try:
            self.root.iconbitmap('hr_icon.ico')
        except:
            pass
        
        self.data = None
        self.current_df = None
        self.calculated_data = None
        
        # Responsive configuration
        self.setup_responsive_grid()
        self.setup_styles()
        self.create_responsive_widgets()
        
        # Bind resize event
        self.root.bind('<Configure>', self.on_window_resize)
        
    def setup_responsive_grid(self):
        """Setup grid configuration untuk responsif"""
        # Configure root grid
        self.root.grid_columnconfigure(0, weight=1)
        self.root.grid_rowconfigure(0, weight=1)
        
    def setup_styles(self):
        """Setup styling dengan font yang responsif"""
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Configure fonts
        self.title_font = Font(family="Segoe UI", size=14, weight="bold")
        self.heading_font = Font(family="Segoe UI", size=11, weight="bold")
        self.normal_font = Font(family="Segoe UI", size=10)
        self.small_font = Font(family="Segoe UI", size=9)
        
        # Configure styles
        self.style.configure('Title.TLabel', font=self.title_font)
        self.style.configure('Heading.TLabel', font=self.heading_font)
        self.style.configure('Normal.TLabel', font=self.normal_font)
        self.style.configure('Small.TLabel', font=self.small_font)
        
        # Configure button styles
        self.style.configure('Primary.TButton', font=self.normal_font, padding=6)
        self.style.configure('Secondary.TButton', font=self.small_font, padding=4)
        
        # Configure notebook style
        self.style.configure('Custom.TNotebook.Tab', font=self.normal_font, padding=[10, 5])
        
    def create_responsive_widgets(self):
        """Membuat widget dengan layout responsif"""
        # Main container dengan scrollbar
        self.main_container = ttk.Frame(self.root)
        self.main_container.grid(row=0, column=0, sticky="nsew", padx=5, pady=5)
        
        # Configure grid untuk main container
        self.main_container.grid_columnconfigure(0, weight=1)
        self.main_container.grid_rowconfigure(1, weight=1)  # Notebook area
        
        # 1. HEADER SECTION
        self.create_header_section()
        
        # 2. CONTENT SECTION (Notebook dengan tab)
        self.create_content_section()
        
        # 3. STATUS BAR
        self.create_status_bar()
        
    def create_header_section(self):
        """Membuat header section yang responsif"""
        # Header frame
        header_frame = ttk.Frame(self.main_container, style='Primary.TFrame')
        header_frame.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        header_frame.grid_columnconfigure(1, weight=1)
        
        # Title
        title_label = ttk.Label(header_frame, 
                               text="📊 HR Analytics Dashboard", 
                               style='Title.TLabel',
                               anchor="center")
        title_label.grid(row=0, column=0, columnspan=3, pady=10, sticky="ew")
        
        # File operations frame
        file_frame = ttk.LabelFrame(header_frame, text="File Operations", padding="10")
        file_frame.grid(row=1, column=0, columnspan=3, sticky="ew", padx=5, pady=5)
        file_frame.grid_columnconfigure(1, weight=1)
        
        # File buttons dengan responsive layout
        button_container = ttk.Frame(file_frame)
        button_container.grid(row=0, column=0, sticky="w")
        
        ttk.Button(button_container, text="📂 Load Excel", 
                  style='Primary.TButton',
                  command=self.load_file).pack(side=tk.LEFT, padx=2)
        
        ttk.Button(button_container, text="🧮 Calculate Metrics", 
                  style='Primary.TButton',
                  command=self.calculate_hr_metrics).pack(side=tk.LEFT, padx=2)
        
        # File info dengan ellipsis untuk path panjang
        self.file_label = ttk.Label(file_frame, text="No file loaded", 
                                   style='Small.TLabel',
                                   relief="sunken", padding=5)
        self.file_label.grid(row=0, column=1, sticky="ew", padx=10)
        
        # HR Parameters frame
        params_frame = ttk.LabelFrame(header_frame, text="HR Parameters", padding="10")
        params_frame.grid(row=2, column=0, columnspan=3, sticky="ew", padx=5, pady=5)
        
        # Grid untuk parameters
        params_frame.grid_columnconfigure(0, weight=1)
        params_frame.grid_columnconfigure(1, weight=1)
        params_frame.grid_columnconfigure(2, weight=1)
        
        # Parameter 1: Retirement Age
        param1_frame = ttk.Frame(params_frame)
        param1_frame.grid(row=0, column=0, sticky="w", padx=5)
        ttk.Label(param1_frame, text="Retirement Age:", 
                 style='Normal.TLabel').pack(side=tk.LEFT)
        self.retirement_age_var = tk.StringVar(value="55")
        ttk.Spinbox(param1_frame, from_=45, to=70, width=8,
                   textvariable=self.retirement_age_var,
                   font=self.small_font).pack(side=tk.LEFT, padx=5)
        
        # Parameter 2: Current Date
        param2_frame = ttk.Frame(params_frame)
        param2_frame.grid(row=0, column=1, sticky="w", padx=5)
        ttk.Label(param2_frame, text="Current Date:", 
                 style='Normal.TLabel').pack(side=tk.LEFT)
        self.current_date_var = tk.StringVar(value=datetime.now().strftime("%Y-%m-%d"))
        ttk.Entry(param2_frame, textvariable=self.current_date_var, 
                 width=12, font=self.small_font).pack(side=tk.LEFT, padx=5)
        
        # Parameter 3: Analysis Period
        param3_frame = ttk.Frame(params_frame)
        param3_frame.grid(row=0, column=2, sticky="w", padx=5)
        ttk.Label(param3_frame, text="Analysis Period:", 
                 style='Normal.TLabel').pack(side=tk.LEFT)
        self.analysis_period_var = tk.StringVar(value="5")
        ttk.Spinbox(param3_frame, from_=1, to=20, width=8,
                   textvariable=self.analysis_period_var,
                   font=self.small_font).pack(side=tk.LEFT, padx=5)
        
        # Analysis Tools frame
        tools_frame = ttk.LabelFrame(header_frame, text="Analysis Tools", padding="10")
        tools_frame.grid(row=3, column=0, columnspan=3, sticky="ew", padx=5, pady=(5, 10))
        tools_frame.grid_columnconfigure(1, weight=1)
        
        # Analysis type dropdown
        ttk.Label(tools_frame, text="Analysis Type:", 
                 style='Normal.TLabel').pack(side=tk.LEFT, padx=5)
        self.hr_analysis_var = tk.StringVar(value="HR Dashboard")
        analysis_combo = ttk.Combobox(tools_frame, 
                                     textvariable=self.hr_analysis_var,
                                     values=["HR Dashboard", "Employee Demographics", 
                                             "Retirement Planning", "Tenure Analysis",
                                             "Age Distribution", "Turnover Prediction",
                                             "Succession Planning", "Workforce Analytics"],
                                     state="readonly",
                                     width=25,
                                     font=self.small_font)
        analysis_combo.pack(side=tk.LEFT, padx=5)
        
        # Action buttons
        button_frame = ttk.Frame(tools_frame)
        button_frame.pack(side=tk.LEFT, padx=10)
        
        ttk.Button(button_frame, text="▶ Run", 
                  style='Primary.TButton',
                  command=self.run_hr_analysis).pack(side=tk.LEFT, padx=2)
        
        ttk.Button(button_frame, text="💡 Insights", 
                  style='Secondary.TButton',
                  command=self.generate_insights).pack(side=tk.LEFT, padx=2)
        
        ttk.Button(button_frame, text="📄 Export", 
                  style='Secondary.TButton',
                  command=self.export_hr_report).pack(side=tk.LEFT, padx=2)
        
    def create_content_section(self):
        """Membuat content section dengan notebook yang responsif"""
        # Notebook container
        notebook_container = ttk.Frame(self.main_container)
        notebook_container.grid(row=1, column=0, sticky="nsew", pady=(0, 10))
        notebook_container.grid_columnconfigure(0, weight=1)
        notebook_container.grid_rowconfigure(0, weight=1)
        
        # Notebook dengan custom style
        self.notebook = ttk.Notebook(notebook_container, style='Custom.TNotebook')
        self.notebook.grid(row=0, column=0, sticky="nsew")
        
        # Create tabs
        self.create_dashboard_tab()
        self.create_data_tab()
        self.create_analysis_tab()
        self.create_visualization_tab()
        self.create_retirement_tab()
        
    def create_dashboard_tab(self):
        """Membuat dashboard tab yang responsif"""
        self.dashboard_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.dashboard_tab, text="📊 Dashboard")
        
        # Configure grid untuk dashboard
        self.dashboard_tab.grid_columnconfigure(0, weight=1)
        self.dashboard_tab.grid_rowconfigure(1, weight=1)  # Charts area
        
        # Scrollable container untuk dashboard
        dashboard_canvas = tk.Canvas(self.dashboard_tab, highlightthickness=0)
        dashboard_scrollbar = ttk.Scrollbar(self.dashboard_tab, orient="vertical", 
                                           command=dashboard_canvas.yview)
        scrollable_frame = ttk.Frame(dashboard_canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: dashboard_canvas.configure(scrollregion=dashboard_canvas.bbox("all"))
        )
        
        dashboard_canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        dashboard_canvas.configure(yscrollcommand=dashboard_scrollbar.set)
        
        # Pack canvas and scrollbar
        dashboard_canvas.grid(row=0, column=0, sticky="nsew")
        dashboard_scrollbar.grid(row=0, column=1, sticky="ns")
        
        # KPI Cards
        self.create_kpi_cards(scrollable_frame)
        
        # Charts Section
        self.create_charts_section(scrollable_frame)
        
    def create_kpi_cards(self, parent_frame):
        """Membuat KPI cards yang responsif"""
        kpi_frame = ttk.LabelFrame(parent_frame, text="Key Performance Indicators", padding="15")
        kpi_frame.grid(row=0, column=0, sticky="ew", padx=10, pady=10)
        kpi_frame.grid_columnconfigure(0, weight=1)
        
        # Container untuk KPI cards
        cards_container = ttk.Frame(kpi_frame)
        cards_container.grid(row=0, column=0, sticky="ew")
        
        # Configure grid untuk cards (responsive columns)
        for i in range(5):  # 5 columns
            cards_container.grid_columnconfigure(i, weight=1)
        
        # KPI cards akan dibuat saat data dimuat
        self.kpi_cards = []
        
        # Placeholder cards
        placeholder_data = [
            {"title": "Total Employees", "value": "0", "icon": "👥"},
            {"title": "Avg Age", "value": "0.0 yrs", "icon": "📅"},
            {"title": "Avg Tenure", "value": "0.0 yrs", "icon": "⏳"},
            {"title": "Near Retirement", "value": "0", "icon": "👵"},
            {"title": "Gender Ratio", "value": "0:0", "icon": "⚥"}
        ]
        
        for i, data in enumerate(placeholder_data):
            card = self.create_kpi_card(cards_container, data, i)
            self.kpi_cards.append(card)
    
    def create_kpi_card(self, parent, data, column):
        """Membuat individual KPI card"""
        card_frame = ttk.Frame(parent, relief="raised", borderwidth=2)
        card_frame.grid(row=0, column=column, sticky="nsew", padx=5, pady=5)
        
        # Configure card frame
        card_frame.grid_columnconfigure(0, weight=1)
        
        # Icon and value
        icon_value_frame = ttk.Frame(card_frame)
        icon_value_frame.grid(row=0, column=0, pady=(10, 5))
        
        ttk.Label(icon_value_frame, text=data["icon"], 
                 font=("Segoe UI", 24)).pack(side=tk.LEFT, padx=5)
        
        value_label = ttk.Label(icon_value_frame, text=data["value"], 
                               font=("Segoe UI", 20, "bold"))
        value_label.pack(side=tk.LEFT, padx=5)
        
        # Title
        ttk.Label(card_frame, text=data["title"], 
                 font=("Segoe UI", 10),
                 foreground="gray").grid(row=1, column=0, pady=(0, 10))
        
        return {"frame": card_frame, "value_label": value_label}
    
    def create_charts_section(self, parent_frame):
        """Membuat charts section yang responsif"""
        charts_frame = ttk.LabelFrame(parent_frame, text="Visualizations", padding="15")
        charts_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=10)
        charts_frame.grid_columnconfigure(0, weight=1)
        charts_frame.grid_rowconfigure(0, weight=1)
        
        # Container untuk charts
        self.charts_container = ttk.Frame(charts_frame)
        self.charts_container.grid(row=0, column=0, sticky="nsew")
        
        # Placeholder untuk charts
        placeholder = ttk.Label(self.charts_container, 
                               text="Charts will appear here after data is loaded",
                               font=("Segoe UI", 12),
                               foreground="gray")
        placeholder.pack(expand=True, fill=tk.BOTH, padx=20, pady=20)
    
    def create_data_tab(self):
        """Membuat data tab dengan table yang responsif"""
        self.data_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.data_tab, text="📋 Employee Data")
        
        # Configure grid untuk data tab
        self.data_tab.grid_columnconfigure(0, weight=1)
        self.data_tab.grid_rowconfigure(0, weight=1)
        
        # Frame untuk table dengan scrollbar
        table_frame = ttk.Frame(self.data_tab)
        table_frame.grid(row=0, column=0, sticky="nsew")
        table_frame.grid_columnconfigure(0, weight=1)
        table_frame.grid_rowconfigure(0, weight=1)
        
        # Treeview dengan double scrollbar
        self.data_tree = ttk.Treeview(table_frame, show="headings")
        
        # Scrollbars
        tree_scroll_y = ttk.Scrollbar(table_frame, orient="vertical", 
                                     command=self.data_tree.yview)
        tree_scroll_x = ttk.Scrollbar(table_frame, orient="horizontal", 
                                     command=self.data_tree.xview)
        self.data_tree.configure(yscrollcommand=tree_scroll_y.set,
                                xscrollcommand=tree_scroll_x.set)
        
        # Grid layout untuk treeview dan scrollbars
        self.data_tree.grid(row=0, column=0, sticky="nsew")
        tree_scroll_y.grid(row=0, column=1, sticky="ns")
        tree_scroll_x.grid(row=1, column=0, sticky="ew")
        
        # Filter frame
        filter_frame = ttk.Frame(self.data_tab)
        filter_frame.grid(row=1, column=0, sticky="ew", pady=(5, 0))
        
        ttk.Label(filter_frame, text="Filter:", 
                 style='Small.TLabel').pack(side=tk.LEFT, padx=5)
        
        self.data_filter_var = tk.StringVar()
        filter_entry = ttk.Entry(filter_frame, textvariable=self.data_filter_var,
                                width=30)
        filter_entry.pack(side=tk.LEFT, padx=5)
        filter_entry.bind('<KeyRelease>', self.filter_data_table)
        
        ttk.Button(filter_frame, text="Clear", 
                  style='Secondary.TButton',
                  command=self.clear_data_filter).pack(side=tk.LEFT, padx=5)
    
    def create_analysis_tab(self):
        """Membuat analysis tab dengan text widget yang responsif"""
        self.analysis_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.analysis_tab, text="📈 Analysis")
        
        # Configure grid
        self.analysis_tab.grid_columnconfigure(0, weight=1)
        self.analysis_tab.grid_rowconfigure(0, weight=1)
        
        # Text widget dengan scrollbar
        self.analysis_text = tk.Text(self.analysis_tab, wrap=tk.WORD,
                                    font=("Consolas", 10))
        
        # Scrollbar
        text_scrollbar = ttk.Scrollbar(self.analysis_tab, 
                                      command=self.analysis_text.yview)
        self.analysis_text.configure(yscrollcommand=text_scrollbar.set)
        
        # Grid layout
        self.analysis_text.grid(row=0, column=0, sticky="nsew")
        text_scrollbar.grid(row=0, column=1, sticky="ns")
        
        # Control frame
        control_frame = ttk.Frame(self.analysis_tab)
        control_frame.grid(row=1, column=0, columnspan=2, sticky="ew", pady=(5, 0))
        
        ttk.Button(control_frame, text="Copy to Clipboard",
                  style='Secondary.TButton',
                  command=self.copy_analysis_to_clipboard).pack(side=tk.LEFT, padx=5)
        
        ttk.Button(control_frame, text="Clear Analysis",
                  style='Secondary.TButton',
                  command=self.clear_analysis).pack(side=tk.LEFT, padx=5)
    
    def create_visualization_tab(self):
        """Membuat visualization tab yang responsif"""
        self.viz_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.viz_tab, text="📊 Charts")
        
        # Configure grid
        self.viz_tab.grid_columnconfigure(0, weight=1)
        self.viz_tab.grid_rowconfigure(1, weight=1)  # Chart area
        
        # Control frame
        control_frame = ttk.Frame(self.viz_tab)
        control_frame.grid(row=0, column=0, sticky="ew", padx=10, pady=10)
        
        ttk.Label(control_frame, text="Chart Type:",
                 style='Normal.TLabel').pack(side=tk.LEFT, padx=5)
        
        self.chart_type_var = tk.StringVar(value="age_distribution")
        chart_combo = ttk.Combobox(control_frame, 
                                  textvariable=self.chart_type_var,
                                  values=["age_distribution", "tenure_distribution", 
                                          "retirement_timeline", "demographics_pie",
                                          "age_vs_tenure", "department_distribution"],
                                  state="readonly",
                                  width=25,
                                  font=self.small_font)
        chart_combo.pack(side=tk.LEFT, padx=5)
        
        ttk.Button(control_frame, text="Generate Chart",
                  style='Primary.TButton',
                  command=self.generate_hr_chart).pack(side=tk.LEFT, padx=10)
        
        ttk.Button(control_frame, text="Save Image",
                  style='Secondary.TButton',
                  command=self.save_chart_image).pack(side=tk.LEFT, padx=5)
        
        # Chart container
        self.chart_container = ttk.Frame(self.viz_tab)
        self.chart_container.grid(row=1, column=0, sticky="nsew", padx=10, pady=(0, 10))
        
        # Configure chart container
        self.chart_container.grid_columnconfigure(0, weight=1)
        self.chart_container.grid_rowconfigure(0, weight=1)
        
        # Placeholder
        self.chart_placeholder = ttk.Label(self.chart_container,
                                          text="Select chart type and click 'Generate Chart'",
                                          font=("Segoe UI", 12),
                                          foreground="gray")
        self.chart_placeholder.grid(row=0, column=0, sticky="nsew")
    
    def create_retirement_tab(self):
        """Membuat retirement planning tab yang responsif"""
        self.retirement_tab = ttk.Frame(self.notebook)
        self.notebook.add(self.retirement_tab, text="👵 Retirement")
        
        # Configure grid
        self.retirement_tab.grid_columnconfigure(0, weight=1)
        self.retirement_tab.grid_rowconfigure(1, weight=1)  # Table area
        
        # Summary frame
        summary_frame = ttk.LabelFrame(self.retirement_tab, text="Summary", padding="10")
        summary_frame.grid(row=0, column=0, sticky="ew", padx=10, pady=10)
        summary_frame.grid_columnconfigure(0, weight=1)
        
        # Summary cards container
        self.retirement_summary_container = ttk.Frame(summary_frame)
        self.retirement_summary_container.grid(row=0, column=0, sticky="ew")
        
        # Configure grid untuk summary cards
        for i in range(4):  # 4 columns
            self.retirement_summary_container.grid_columnconfigure(i, weight=1)
        
        # Table frame
        table_frame = ttk.LabelFrame(self.retirement_tab, text="Employees Near Retirement", padding="10")
        table_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=(0, 10))
        table_frame.grid_columnconfigure(0, weight=1)
        table_frame.grid_rowconfigure(0, weight=1)
        
        # Treeview untuk retirement data
        self.retirement_tree = ttk.Treeview(table_frame, show="headings")
        
        # Scrollbars
        tree_scroll_y = ttk.Scrollbar(table_frame, orient="vertical",
                                     command=self.retirement_tree.yview)
        tree_scroll_x = ttk.Scrollbar(table_frame, orient="horizontal",
                                     command=self.retirement_tree.xview)
        self.retirement_tree.configure(yscrollcommand=tree_scroll_y.set,
                                      xscrollcommand=tree_scroll_x.set)
        
        # Grid layout
        self.retirement_tree.grid(row=0, column=0, sticky="nsew")
        tree_scroll_y.grid(row=0, column=1, sticky="ns")
        tree_scroll_x.grid(row=1, column=0, sticky="ew")
    
    def create_status_bar(self):
        """Membuat status bar yang responsif"""
        self.status_var = tk.StringVar(value="Ready - Load HR data to begin")
        
        status_bar = ttk.Frame(self.main_container, relief="sunken")
        status_bar.grid(row=2, column=0, sticky="ew")
        status_bar.grid_columnconfigure(0, weight=1)
        
        ttk.Label(status_bar, textvariable=self.status_var,
                 style='Small.TLabel',
                 anchor="w",
                 padding=(5, 2)).grid(row=0, column=0, sticky="ew")
        
        # Progress bar (hidden by default)
        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(status_bar, variable=self.progress_var,
                                           mode='determinate', length=100)
        self.progress_bar.grid(row=0, column=1, sticky="e", padx=5)
        self.progress_bar.grid_remove()  # Hide initially
    
    def on_window_resize(self, event):
        """Handle window resize event"""
        # Update font sizes based on window width
        window_width = self.root.winfo_width()
        
        if window_width < 1300:
            # Small screen adjustments
            self.small_font.configure(size=8)
            self.normal_font.configure(size=9)
            self.heading_font.configure(size=10)
        elif window_width < 1600:
            # Medium screen
            self.small_font.configure(size=9)
            self.normal_font.configure(size=10)
            self.heading_font.configure(size=11)
        else:
            # Large screen
            self.small_font.configure(size=10)
            self.normal_font.configure(size=11)
            self.heading_font.configure(size=12)
    
    # ==================== BUSINESS LOGIC METHODS ====================
    
    def load_file(self):
        """Memuat file Excel"""
        file_path = filedialog.askopenfilename(
            title="Select Excel File",
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                self.show_progress(True)
                self.status_var.set("Loading HR data...")
                self.root.update()
                
                # Membaca file Excel
                self.data = pd.read_excel(file_path)
                self.current_df = self.data.copy()
                
                # Update UI
                self.display_data()
                self.calculate_hr_metrics()
                
                # Update file label dengan ellipsis untuk path panjang
                filename = file_path.split('/')[-1]
                if len(filename) > 40:
                    filename = filename[:37] + "..."
                self.file_label.config(text=f"Loaded: {filename}")
                
                self.status_var.set(f"Data loaded: {len(self.data)} employees")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to load file: {str(e)}")
                self.status_var.set("Error loading data")
            finally:
                self.show_progress(False)
    
    def show_progress(self, show=True):
        """Show or hide progress bar"""
        if show:
            self.progress_bar.grid()
            self.progress_bar.start(10)
        else:
            self.progress_bar.stop()
            self.progress_bar.grid_remove()
    
    def calculate_hr_metrics(self):
        """Menghitung metrik HR"""
        if self.data is None:
            messagebox.showwarning("Warning", "Please load HR data first!")
            return
        
        try:
            self.show_progress(True)
            self.status_var.set("Calculating HR metrics...")
            self.root.update()
            
            df = self.data.copy()
            
            # Calculate metrics
            current_date = pd.to_datetime(self.current_date_var.get())
            retirement_age = float(self.retirement_age_var.get())
            
            # Usia saat ini
            if 'Tanggal Lahir' in df.columns:
                df['Tanggal Lahir'] = pd.to_datetime(df['Tanggal Lahir'])
                df['Usia Saat ini'] = ((current_date - df['Tanggal Lahir']).dt.days / 365.25)
            
            # Masa kerja
            if 'Tgl Masuk' in df.columns:
                df['Tgl Masuk'] = pd.to_datetime(df['Tgl Masuk'])
                df['Lama kerja'] = ((current_date - df['Tgl Masuk']).dt.days / 365.25)
            
            # Tahun sampai pensiun
            if 'Usia Saat ini' in df.columns:
                df['Years to Retirement'] = retirement_age - df['Usia Saat ini']
                df['Years to Retirement'] = df['Years to Retirement'].clip(lower=0)
                
                # Kategori pensiun
                conditions = [
                    (df['Years to Retirement'] <= 0),
                    (df['Years to Retirement'] <= 5),
                    (df['Years to Retirement'] <= 10),
                    (df['Years to Retirement'] > 10)
                ]
                choices = ['Retired', 'Near Retirement', 'Mid Career', 'Early Career']
                df['Retirement Category'] = np.select(conditions, choices, default='Unknown')
                
                # Tahun pensiun
                if 'Tanggal Lahir' in df.columns:
                    df['Retirement Year'] = (df['Tanggal Lahir'] + 
                                           pd.DateOffset(years=int(retirement_age))).dt.year
            
            # Simpan data yang dihitung
            self.calculated_data = df
            self.data = df
            
            # Update UI
            self.update_kpi_cards()
            self.update_retirement_summary()
            self.display_data()
            
            self.status_var.set(f"Metrics calculated for {len(df)} employees")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to calculate metrics: {str(e)}")
            self.status_var.set("Error calculating metrics")
        finally:
            self.show_progress(False)
    
    def update_kpi_cards(self):
        """Update KPI cards dengan data terbaru"""
        if self.calculated_data is None:
            return
        
        df = self.calculated_data
        
        # Calculate KPI values
        total_emp = len(df)
        avg_age = df['Usia Saat ini'].mean() if 'Usia Saat ini' in df.columns else 0
        avg_tenure = df['Lama kerja'].mean() if 'Lama kerja' in df.columns else 0
        near_retirement = len(df[df['Years to Retirement'] <= 5]) if 'Years to Retirement' in df.columns else 0
        
        # Gender ratio
        if 'Jenis Kelamin' in df.columns:
            male_count = len(df[df['Jenis Kelamin'] == 'L'])
            female_count = len(df[df['Jenis Kelamin'] == 'P'])
            gender_ratio = f"{male_count}:{female_count}"
        else:
            gender_ratio = "N/A"
        
        # Update KPI cards
        kpi_data = [
            {"value": f"{total_emp:,}", "color": "black"},
            {"value": f"{avg_age:.1f} yrs", "color": "black"},
            {"value": f"{avg_tenure:.1f} yrs", "color": "black"},
            {"value": f"{near_retirement}", "color": "orange" if near_retirement > 0 else "black"},
            {"value": gender_ratio, "color": "black"}
        ]
        
        for i, card in enumerate(self.kpi_cards):
            if i < len(kpi_data):
                card["value_label"].config(text=kpi_data[i]["value"], 
                                          foreground=kpi_data[i]["color"])
    
    def update_retirement_summary(self):
        """Update retirement summary cards"""
        if self.calculated_data is None:
            return
        
        df = self.calculated_data
        
        # Clear existing cards
        for widget in self.retirement_summary_container.winfo_children():
            widget.destroy()
        
        # Calculate retirement statistics
        retired_now = len(df[df['Years to Retirement'] <= 0])
        near_retire = len(df[(df['Years to Retirement'] > 0) & (df['Years to Retirement'] <= 5)])
        mid_retire = len(df[(df['Years to Retirement'] > 5) & (df['Years to Retirement'] <= 10)])
        total_risk = near_retire + mid_retire
        
        # Create summary cards
        summary_data = [
            {"title": "Already Retired", "value": retired_now, "color": "red", "icon": "👴"},
            {"title": "Retiring in ≤5 yrs", "value": near_retire, "color": "orange", "icon": "⚠️"},
            {"title": "Retiring in 5-10 yrs", "value": mid_retire, "color": "gold", "icon": "📅"},
            {"title": "Total at Risk", "value": total_risk, "color": "darkorange", "icon": "🎯"}
        ]
        
        for i, data in enumerate(summary_data):
            self.create_retirement_card(self.retirement_summary_container, data, i)
        
        # Update retirement table
        self.update_retirement_table()
    
    def create_retirement_card(self, parent, data, column):
        """Membuat retirement summary card"""
        card = ttk.Frame(parent, relief="raised", borderwidth=1)
        card.grid(row=0, column=column, sticky="nsew", padx=5, pady=5)
        
        # Icon
        ttk.Label(card, text=data["icon"], 
                 font=("Segoe UI", 20)).pack(pady=(10, 5))
        
        # Value
        ttk.Label(card, text=str(data["value"]), 
                 font=("Segoe UI", 24, "bold"),
                 foreground=data["color"]).pack()
        
        # Title
        ttk.Label(card, text=data["title"], 
                 font=("Segoe UI", 9),
                 foreground="gray").pack(pady=(5, 10))
    
    def update_retirement_table(self):
        """Update retirement table dengan data"""
        if self.calculated_data is None:
            return
        
        df = self.calculated_data
        
        # Clear existing data
        for item in self.retirement_tree.get_children():
            self.retirement_tree.delete(item)
        
        # Setup columns
        columns = ['NIK', 'NAMA', 'SECTION', 'JABATAN', 'Usia', 'Tenure', 'Years to Retirement']
        available_cols = [col for col in columns if col in df.columns or 
                         (col == 'Usia' and 'Usia Saat ini' in df.columns) or
                         (col == 'Tenure' and 'Lama kerja' in df.columns) or
                         (col == 'Years to Retirement' and 'Years to Retirement' in df.columns)]
        
        self.retirement_tree["columns"] = available_cols
        self.retirement_tree["show"] = "headings"
        
        # Configure headings
        for col in available_cols:
            self.retirement_tree.heading(col, text=col)
            self.retirement_tree.column(col, width=100)
        
        # Add near-retirement employees
        near_retire_df = df[df['Years to Retirement'] <= 5].sort_values('Years to Retirement')
        
        for _, row in near_retire_df.iterrows():
            values = []
            for col in available_cols:
                if col == 'NIK':
                    values.append(row.get('NIK', ''))
                elif col == 'NAMA':
                    values.append(row.get('NAMA', ''))
                elif col == 'SECTION':
                    values.append(row.get('SECTION', ''))
                elif col == 'JABATAN':
                    values.append(row.get('JABATAN', ''))
                elif col == 'Usia':
                    values.append(f"{row.get('Usia Saat ini', 0):.1f}")
                elif col == 'Tenure':
                    values.append(f"{row.get('Lama kerja', 0):.1f}")
                elif col == 'Years to Retirement':
                    values.append(f"{row.get('Years to Retirement', 0):.1f}")
            
            self.retirement_tree.insert("", "end", values=values)
    
    def display_data(self):
        """Menampilkan data di Treeview"""
        if self.data is None:
            return
        
        # Clear existing data
        for item in self.data_tree.get_children():
            self.data_tree.delete(item)
        
        # Setup columns (pilih kolom penting)
        important_cols = ['NIK', 'NAMA', 'PLANT', 'SECTION', 'JABATAN', 
                         'Status Karyawan', 'Jenis Kelamin']
        
        if 'Usia Saat ini' in self.data.columns:
            important_cols.append('Usia Saat ini')
        if 'Lama kerja' in self.data.columns:
            important_cols.append('Lama kerja')
        if 'Years to Retirement' in self.data.columns:
            important_cols.append('Years to Retirement')
        
        # Filter kolom yang ada di data
        available_cols = [col for col in important_cols if col in self.data.columns]
        
        self.data_tree["columns"] = available_cols
        self.data_tree["show"] = "headings"
        
        # Configure headings
        for col in available_cols:
            self.data_tree.heading(col, text=col)
            self.data_tree.column(col, width=120, minwidth=50, stretch=True)
        
        # Insert data (batasi untuk performa)
        max_rows = min(1000, len(self.data))
        for idx in range(max_rows):
            row = self.data.iloc[idx]
            values = []
            for col in available_cols:
                val = row[col]
                if pd.isna(val):
                    values.append("")
                elif isinstance(val, (int, np.integer)):
                    values.append(str(val))
                elif isinstance(val, (float, np.floating)):
                    if col in ['Usia Saat ini', 'Lama kerja', 'Years to Retirement']:
                        values.append(f"{val:.1f}")
                    else:
                        values.append(f"{val:.2f}")
                else:
                    values.append(str(val))
            self.data_tree.insert("", "end", values=values)
    
    def filter_data_table(self, event=None):
        """Filter data table berdasarkan input"""
        if self.data is None:
            return
        
        filter_text = self.data_filter_var.get().lower()
        
        # Clear existing data
        for item in self.data_tree.get_children():
            self.data_tree.delete(item)
        
        # Filter data
        if filter_text:
            mask = pd.Series(False, index=self.data.index)
            for col in self.data.columns:
                if self.data[col].dtype == 'object':
                    mask = mask | self.data[col].astype(str).str.lower().str.contains(filter_text, na=False)
            
            filtered_data = self.data[mask]
        else:
            filtered_data = self.data
        
        # Insert filtered data
        max_rows = min(500, len(filtered_data))
        available_cols = self.data_tree["columns"]
        
        for idx in range(max_rows):
            row = filtered_data.iloc[idx]
            values = []
            for col in available_cols:
                val = row[col] if col in row else ""
                if pd.isna(val):
                    values.append("")
                elif isinstance(val, (int, np.integer)):
                    values.append(str(val))
                elif isinstance(val, (float, np.floating)):
                    if col in ['Usia Saat ini', 'Lama kerja', 'Years to Retirement']:
                        values.append(f"{val:.1f}")
                    else:
                        values.append(f"{val:.2f}")
                else:
                    values.append(str(val))
            self.data_tree.insert("", "end", values=values)
    
    def clear_data_filter(self):
        """Clear filter dari data table"""
        self.data_filter_var.set("")
        self.filter_data_table()
    
    def run_hr_analysis(self):
        """Menjalankan analisis HR"""
        if self.calculated_data is None:
            messagebox.showwarning("Warning", "Please calculate HR metrics first!")
            return
        
        analysis_type = self.hr_analysis_var.get()
        
        try:
            self.show_progress(True)
            self.status_var.set(f"Running {analysis_type}...")
            self.root.update()
            
            # Pilih notebook tab berdasarkan analisis
            if analysis_type == "HR Dashboard":
                self.notebook.select(self.dashboard_tab)
                self.update_dashboard_charts()
            elif analysis_type == "Retirement Planning":
                self.notebook.select(self.retirement_tab)
                self.update_retirement_summary()
            elif analysis_type in ["Employee Demographics", "Tenure Analysis", 
                                 "Age Distribution", "Turnover Prediction",
                                 "Succession Planning", "Workforce Analytics"]:
                self.notebook.select(self.analysis_tab)
                self.perform_detailed_analysis(analysis_type)
            
            self.status_var.set(f"{analysis_type} completed")
            
        except Exception as e:
            messagebox.showerror("Error", f"Analysis failed: {str(e)}")
            self.status_var.set("Analysis failed")
        finally:
            self.show_progress(False)
    
    def update_dashboard_charts(self):
        """Update charts di dashboard"""
        if self.calculated_data is None:
            return
        
        df = self.calculated_data
        
        # Clear existing charts
        for widget in self.charts_container.winfo_children():
            widget.destroy()
        
        # Create figure dengan subplots
        fig = Figure(figsize=(12, 8), dpi=100)
        
        # Chart 1: Age Distribution
        ax1 = fig.add_subplot(221)
        if 'Usia Saat ini' in df.columns:
            df['Usia Saat ini'].hist(bins=20, ax=ax1, alpha=0.7, edgecolor='black')
            ax1.set_xlabel('Age (years)')
            ax1.set_ylabel('Count')
            ax1.set_title('Age Distribution')
            ax1.grid(True, alpha=0.3)
        
        # Chart 2: Tenure Distribution
        ax2 = fig.add_subplot(222)
        if 'Lama kerja' in df.columns:
            df['Lama kerja'].hist(bins=20, ax=ax2, alpha=0.7, edgecolor='black', color='green')
            ax2.set_xlabel('Tenure (years)')
            ax2.set_ylabel('Count')
            ax2.set_title('Tenure Distribution')
            ax2.grid(True, alpha=0.3)
        
        # Chart 3: Retirement Timeline
        ax3 = fig.add_subplot(223)
        if 'Retirement Year' in df.columns:
            retirement_by_year = df['Retirement Year'].value_counts().sort_index()
            ax3.bar(retirement_by_year.index.astype(str), retirement_by_year.values, alpha=0.7)
            ax3.set_xlabel('Year')
            ax3.set_ylabel('Retirements')
            ax3.set_title('Retirement Projection')
            ax3.tick_params(axis='x', rotation=45)
            ax3.grid(True, alpha=0.3)
        
        # Chart 4: Department Distribution
        ax4 = fig.add_subplot(224)
        if 'SECTION' in df.columns:
            dept_dist = df['SECTION'].value_counts().head(10)
            ax4.barh(range(len(dept_dist)), dept_dist.values, alpha=0.7)
            ax4.set_yticks(range(len(dept_dist)))
            ax4.set_yticklabels(dept_dist.index)
            ax4.set_xlabel('Number of Employees')
            ax4.set_title('Top 10 Departments')
            ax4.grid(True, alpha=0.3, axis='x')
        
        fig.tight_layout()
        
        # Embed chart
        canvas = FigureCanvasTkAgg(fig, self.charts_container)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
    
    def perform_detailed_analysis(self, analysis_type):
        """Melakukan analisis detail"""
        df = self.calculated_data
        
        analysis_text = f"=== {analysis_type.upper()} ===\n\n"
        
        if analysis_type == "Employee Demographics":
            analysis_text += self.analyze_demographics(df)
        elif analysis_type == "Tenure Analysis":
            analysis_text += self.analyze_tenure(df)
        elif analysis_type == "Age Distribution":
            analysis_text += self.analyze_age_distribution(df)
        elif analysis_type == "Turnover Prediction":
            analysis_text += self.analyze_turnover(df)
        elif analysis_type == "Succession Planning":
            analysis_text += self.analyze_succession(df)
        elif analysis_type == "Workforce Analytics":
            analysis_text += self.analyze_workforce(df)
        
        self.analysis_text.delete(1.0, tk.END)
        self.analysis_text.insert(1.0, analysis_text)
    
    def analyze_demographics(self, df):
        """Analisis demografi"""
        text = "Employee Demographics Analysis\n\n"
        
        # Gender distribution
        if 'Jenis Kelamin' in df.columns:
            gender_dist = df['Jenis Kelamin'].value_counts()
            text += "Gender Distribution:\n"
            for gender, count in gender_dist.items():
                percentage = (count / len(df)) * 100
                text += f"  {gender}: {count} ({percentage:.1f}%)\n"
            text += "\n"
        
        # Department distribution
        if 'SECTION' in df.columns:
            dept_dist = df['SECTION'].value_counts().head(10)
            text += "Top 10 Departments:\n"
            for dept, count in dept_dist.items():
                percentage = (count / len(df)) * 100
                text += f"  {dept}: {count} ({percentage:.1f}%)\n"
            text += "\n"
        
        # Position distribution
        if 'JABATAN' in df.columns:
            pos_dist = df['JABATAN'].value_counts().head(10)
            text += "Top 10 Positions:\n"
            for pos, count in pos_dist.items():
                percentage = (count / len(df)) * 100
                text += f"  {pos}: {count} ({percentage:.1f}%)\n"
        
        return text
    
    def analyze_tenure(self, df):
        """Analisis masa kerja"""
        text = "Tenure Analysis\n\n"
        
        if 'Lama kerja' in df.columns:
            text += f"Average Tenure: {df['Lama kerja'].mean():.1f} years\n"
            text += f"Median Tenure: {df['Lama kerja'].median():.1f} years\n"
            text += f"Minimum Tenure: {df['Lama kerja'].min():.1f} years\n"
            text += f"Maximum Tenure: {df['Lama kerja'].max():.1f} years\n\n"
            
            # Tenure groups
            bins = [0, 1, 3, 5, 10, 20, 50]
            labels = ['<1', '1-3', '3-5', '5-10', '10-20', '20+']
            
            tenure_groups = pd.cut(df['Lama kerja'], bins=bins, labels=labels)
            group_counts = tenure_groups.value_counts().sort_index()
            
            text += "Tenure Distribution:\n"
            for group, count in group_counts.items():
                percentage = (count / len(df)) * 100
                text += f"  {group} years: {count} ({percentage:.1f}%)\n"
        
        return text
    
    def analyze_age_distribution(self, df):
        """Analisis distribusi usia"""
        text = "Age Distribution Analysis\n\n"
        
        if 'Usia Saat ini' in df.columns:
            text += f"Average Age: {df['Usia Saat ini'].mean():.1f} years\n"
            text += f"Median Age: {df['Usia Saat ini'].median():.1f} years\n"
            text += f"Minimum Age: {df['Usia Saat ini'].min():.1f} years\n"
            text += f"Maximum Age: {df['Usia Saat ini'].max():.1f} years\n\n"
            
            # Age groups
            bins = [0, 25, 35, 45, 55, 100]
            labels = ['<25', '25-35', '35-45', '45-55', '55+']
            
            age_groups = pd.cut(df['Usia Saat ini'], bins=bins, labels=labels)
            group_counts = age_groups.value_counts().sort_index()
            
            text += "Age Group Distribution:\n"
            for group, count in group_counts.items():
                percentage = (count / len(df)) * 100
                text += f"  {group}: {count} ({percentage:.1f}%)\n"
        
        return text
    
    def analyze_turnover(self, df):
        """Analisis turnover"""
        text = "Turnover Risk Analysis\n\n"
        
        if 'Years to Retirement' in df.columns and 'Lama kerja' in df.columns:
            # Employees near retirement
            near_retire = len(df[df['Years to Retirement'] <= 5])
            text += f"Employees retiring in ≤5 years: {near_retire}\n"
            
            # Employees with 1-5 years tenure (higher turnover risk)
            risky_tenure = len(df[(df['Lama kerja'] >= 1) & (df['Lama kerja'] <= 5)])
            text += f"Employees with 1-5 years tenure: {risky_tenure}\n"
            
            # Total at risk
            total_risk = near_retire + risky_tenure
            risk_percentage = (total_risk / len(df)) * 100
            text += f"\nTotal turnover risk: {total_risk} ({risk_percentage:.1f}% of workforce)\n\n"
            
            if risk_percentage > 30:
                text += "⚠️  HIGH TURNOVER RISK - Immediate action needed!\n"
            elif risk_percentage > 15:
                text += "⚠️  MODERATE TURNOVER RISK - Monitor closely\n"
            else:
                text += "✅  LOW TURNOVER RISK - Maintain current strategies\n"
        
        return text
    
    def analyze_succession(self, df):
        """Analisis suksesi"""
        text = "Succession Planning Analysis\n\n"
        
        if 'Years to Retirement' in df.columns and 'JABATAN' in df.columns:
            # Identify leadership positions
            leadership_keywords = ['manager', 'director', 'head', 'chief', 'vp', 'lead', 'supervisor']
            
            leadership_positions = []
            for position in df['JABATAN'].unique():
                if any(keyword in str(position).lower() for keyword in leadership_keywords):
                    leadership_positions.append(position)
            
            text += f"Leadership positions identified: {len(leadership_positions)}\n\n"
            
            # Analyze each leadership position
            for position in leadership_positions[:10]:  # Limit to first 10
                position_data = df[df['JABATAN'] == position]
                at_risk = len(position_data[position_data['Years to Retirement'] <= 5])
                
                if at_risk > 0:
                    text += f"⚠️  {position}: {at_risk}/{len(position_data)} at retirement risk\n"
        
        return text
    
    def analyze_workforce(self, df):
        """Analisis tenaga kerja"""
        text = "Workforce Analytics\n\n"
        
        text += f"Total Employees: {len(df)}\n"
        
        if 'Usia Saat ini' in df.columns:
            text += f"Average Age: {df['Usia Saat ini'].mean():.1f} years\n"
        
        if 'Lama kerja' in df.columns:
            text += f"Average Tenure: {df['Lama kerja'].mean():.1f} years\n"
        
        if 'Years to Retirement' in df.columns:
            near_retire = len(df[df['Years to Retirement'] <= 5])
            text += f"Near Retirement (≤5 years): {near_retire}\n"
        
        # Workforce composition
        if 'SECTION' in df.columns:
            largest_dept = df['SECTION'].value_counts().index[0]
            largest_count = df['SECTION'].value_counts().iloc[0]
            percentage = (largest_count / len(df)) * 100
            text += f"\nLargest Department: {largest_dept} ({largest_count} employees, {percentage:.1f}%)\n"
        
        return text
    
    def generate_hr_chart(self):
        """Generate chart berdasarkan pilihan"""
        if self.calculated_data is None:
            messagebox.showwarning("Warning", "Please calculate HR metrics first!")
            return
        
        df = self.calculated_data
        chart_type = self.chart_type_var.get()
        
        # Clear existing chart
        for widget in self.chart_container.winfo_children():
            widget.destroy()
        
        try:
            fig = Figure(figsize=(10, 6), dpi=100)
            
            if chart_type == "age_distribution":
                ax = fig.add_subplot(111)
                df['Usia Saat ini'].hist(bins=20, ax=ax, alpha=0.7, edgecolor='black')
                ax.set_xlabel('Age (years)')
                ax.set_ylabel('Count')
                ax.set_title('Age Distribution')
                ax.grid(True, alpha=0.3)
                
            elif chart_type == "tenure_distribution":
                ax = fig.add_subplot(111)
                df['Lama kerja'].hist(bins=20, ax=ax, alpha=0.7, edgecolor='black', color='green')
                ax.set_xlabel('Tenure (years)')
                ax.set_ylabel('Count')
                ax.set_title('Tenure Distribution')
                ax.grid(True, alpha=0.3)
                
            elif chart_type == "retirement_timeline":
                ax = fig.add_subplot(111)
                retirement_by_year = df['Retirement Year'].value_counts().sort_index()
                ax.bar(retirement_by_year.index.astype(str), retirement_by_year.values, alpha=0.7)
                ax.set_xlabel('Year')
                ax.set_ylabel('Retirements')
                ax.set_title('Retirement Projection Timeline')
                ax.tick_params(axis='x', rotation=45)
                ax.grid(True, alpha=0.3)
                
            elif chart_type == "demographics_pie":
                ax = fig.add_subplot(111)
                gender_dist = df['Jenis Kelamin'].value_counts()
                ax.pie(gender_dist.values, labels=gender_dist.index, autopct='%1.1f%%')
                ax.set_title('Gender Distribution')
                
            elif chart_type == "age_vs_tenure":
                ax = fig.add_subplot(111)
                ax.scatter(df['Usia Saat ini'], df['Lama kerja'], alpha=0.6)
                ax.set_xlabel('Age (years)')
                ax.set_ylabel('Tenure (years)')
                ax.set_title('Age vs Tenure')
                ax.grid(True, alpha=0.3)
                
            elif chart_type == "department_distribution":
                ax = fig.add_subplot(111)
                dept_dist = df['SECTION'].value_counts().head(15)
                ax.barh(range(len(dept_dist)), dept_dist.values, alpha=0.7)
                ax.set_yticks(range(len(dept_dist)))
                ax.set_yticklabels(dept_dist.index)
                ax.set_xlabel('Number of Employees')
                ax.set_title('Top 15 Departments')
                ax.grid(True, alpha=0.3, axis='x')
            
            fig.tight_layout()
            
            # Embed chart
            canvas = FigureCanvasTkAgg(fig, self.chart_container)
            canvas.draw()
            canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to create chart: {str(e)}")
    
    def save_chart_image(self):
        """Save chart sebagai image"""
        for widget in self.chart_container.winfo_children():
            if isinstance(widget, FigureCanvasTkAgg):
                fig = widget.figure
                file_path = filedialog.asksaveasfilename(
                    defaultextension=".png",
                    filetypes=[("PNG files", "*.png"), ("PDF files", "*.pdf"), 
                              ("All files", "*.*")]
                )
                if file_path:
                    fig.savefig(file_path, dpi=300, bbox_inches='tight')
                    messagebox.showinfo("Success", f"Chart saved to:\n{file_path}")
                return
        messagebox.showwarning("Warning", "No chart to save!")
    
    def generate_insights(self):
        """Generate insights dari data"""
        if self.calculated_data is None:
            messagebox.showwarning("Warning", "Please calculate HR metrics first!")
            return
        
        df = self.calculated_data
        
        insights = "=== HR INSIGHTS ===\n\n"
        
        # Workforce size
        insights += f"📊 Workforce Size: {len(df)} employees\n\n"
        
        # Age insights
        if 'Usia Saat ini' in df.columns:
            avg_age = df['Usia Saat ini'].mean()
            insights += f"📅 Average Age: {avg_age:.1f} years\n"
            
            if avg_age > 45:
                insights += "  ⚠️  Workforce is aging - Consider recruitment of younger talent\n"
            elif avg_age < 35:
                insights += "  ✅ Workforce is relatively young\n"
        
        # Tenure insights
        if 'Lama kerja' in df.columns:
            avg_tenure = df['Lama kerja'].mean()
            insights += f"\n⏳ Average Tenure: {avg_tenure:.1f} years\n"
            
            if avg_tenure > 10:
                insights += "  ✅ High experience level - Strong institutional knowledge\n"
            elif avg_tenure < 3:
                insights += "  ⚠️  Low tenure - Consider retention strategies\n"
        
        # Retirement insights
        if 'Years to Retirement' in df.columns:
            near_retire = len(df[df['Years to Retirement'] <= 5])
            insights += f"\n👵 Near Retirement (≤5 years): {near_retire} employees\n"
            
            if near_retire > len(df) * 0.2:
                insights += "  🚨 HIGH RETIREMENT RISK - Succession planning urgently needed!\n"
            elif near_retire > len(df) * 0.1:
                insights += "  ⚠️  Moderate retirement risk - Start succession planning\n"
            else:
                insights += "  ✅ Low retirement risk\n"
        
        # Department concentration
        if 'SECTION' in df.columns:
            largest_dept = df['SECTION'].value_counts().index[0]
            largest_count = df['SECTION'].value_counts().iloc[0]
            percentage = (largest_count / len(df)) * 100
            
            insights += f"\n🏢 Largest Department: {largest_dept} ({percentage:.1f}% of workforce)\n"
            
            if percentage > 40:
                insights += "  ⚠️  High concentration - Consider diversifying departments\n"
        
        # Gender balance
        if 'Jenis Kelamin' in df.columns:
            gender_counts = df['Jenis Kelamin'].value_counts()
            if len(gender_counts) >= 2:
                ratio = gender_counts.iloc[0] / gender_counts.iloc[1]
                insights += f"\n⚥ Gender Ratio: {gender_counts.index[0]}:{gender_counts.index[1]} = {ratio:.1f}:1\n"
                
                if ratio > 3:
                    insights += "  ⚠️  Significant gender imbalance\n"
        
        insights += "\n=== RECOMMENDATIONS ===\n\n"
        
        # Generate recommendations
        recommendations = []
        
        if 'Years to Retirement' in df.columns:
            if len(df[df['Years to Retirement'] <= 3]) > 10:
                recommendations.append("1. Implement succession planning program")
                recommendations.append("2. Start knowledge transfer initiatives")
        
        if 'Lama kerja' in df.columns:
            if len(df[df['Lama kerja'] < 2]) > len(df) * 0.3:
                recommendations.append("3. Enhance onboarding and training programs")
        
        if 'Usia Saat ini' in df.columns:
            if df['Usia Saat ini'].mean() > 45:
                recommendations.append("4. Develop recruitment strategy for younger talent")
        
        if not recommendations:
            recommendations.append("1. Continue monitoring workforce metrics")
            recommendations.append("2. Regular workforce planning reviews")
            recommendations.append("3. Maintain current HR strategies")
        
        for rec in recommendations[:5]:  # Limit to 5 recommendations
            insights += f"• {rec}\n"
        
        self.analysis_text.delete(1.0, tk.END)
        self.analysis_text.insert(1.0, insights)
        self.notebook.select(self.analysis_tab)
    
    def export_hr_report(self):
        """Export laporan HR"""
        if self.calculated_data is None:
            messagebox.showwarning("Warning", "No data to export!")
            return
        
        file_path = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx"), ("CSV files", "*.csv"), 
                      ("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                self.show_progress(True)
                self.status_var.set("Exporting report...")
                self.root.update()
                
                df = self.calculated_data
                
                if file_path.endswith('.xlsx'):
                    with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                        # Sheet 1: Employee Data
                        df.to_excel(writer, sheet_name='Employee Data', index=False)
                        
                        # Sheet 2: Summary
                        summary_data = {
                            'Metric': ['Total Employees', 'Average Age', 'Average Tenure', 
                                      'Near Retirement', 'Retirement Risk Score'],
                            'Value': [len(df), 
                                     f"{df['Usia Saat ini'].mean():.1f}" if 'Usia Saat ini' in df.columns else 'N/A',
                                     f"{df['Lama kerja'].mean():.1f}" if 'Lama kerja' in df.columns else 'N/A',
                                     len(df[df['Years to Retirement'] <= 5]) if 'Years to Retirement' in df.columns else 'N/A',
                                     'Medium']
                        }
                        pd.DataFrame(summary_data).to_excel(writer, sheet_name='Summary', index=False)
                
                elif file_path.endswith('.csv'):
                    df.to_csv(file_path, index=False)
                
                elif file_path.endswith('.txt'):
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(f"HR Analytics Report\n{'='*50}\n\n")
                        f.write(f"Report Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
                        f.write(f"Total Employees: {len(df)}\n\n")
                        
                        if 'Usia Saat ini' in df.columns:
                            f.write(f"Average Age: {df['Usia Saat ini'].mean():.1f} years\n")
                        
                        if 'Lama kerja' in df.columns:
                            f.write(f"Average Tenure: {df['Lama kerja'].mean():.1f} years\n")
                
                messagebox.showinfo("Success", f"Report exported to:\n{file_path}")
                self.status_var.set(f"Report exported: {file_path.split('/')[-1]}")
                
            except Exception as e:
                messagebox.showerror("Error", f"Export failed: {str(e)}")
            finally:
                self.show_progress(False)
    
    def copy_analysis_to_clipboard(self):
        """Copy analysis text ke clipboard"""
        analysis_text = self.analysis_text.get(1.0, tk.END)
        if analysis_text.strip():
            self.root.clipboard_clear()
            self.root.clipboard_append(analysis_text)
            self.status_var.set("Analysis copied to clipboard")
    
    def clear_analysis(self):
        """Clear analysis text"""
        self.analysis_text.delete(1.0, tk.END)
        self.status_var.set("Analysis cleared")

def main():
    root = tk.Tk()
    app = ResponsiveHRDataScienceApp(root)
    
    # Center window on screen
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry(f'{width}x{height}+{x}+{y}')
    
    root.mainloop()

if __name__ == "__main__":
    main()