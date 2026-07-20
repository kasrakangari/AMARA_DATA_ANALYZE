(require '[cheshire.core :as json]
         '[clojure.string :as str]
         '[metabase.app-db.env :as app-db])

(def table-names
  {"People" "افراد"
   "Orders" "سفارش‌ها"
   "Products" "محصولات"
   "Reviews" "دیدگاه‌ها"
   "Feedback" "بازخورد"
   "Accounts" "حساب‌ها"
   "Analytic Events" "رویدادهای تحلیلی"
   "Invoices" "صورت‌حساب‌ها"})

(def field-names
  {"State" "استان"
   "Quantity" "تعداد"
   "Discount" "تخفیف"
   "ID" "شناسه"
   "Total" "مجموع"
   "Tax" "مالیات"
   "Email" "ایمیل"
   "Subtotal" "جمع جزء"
   "User ID" "شناسه کاربر"
   "Birth Date" "تاریخ تولد"
   "Created At" "تاریخ ایجاد"
   "Product ID" "شناسه محصول"
   "Rating" "امتیاز"
   "Title" "عنوان"
   "Category" "دسته‌بندی"
   "Longitude" "طول جغرافیایی"
   "Rating Mapped" "امتیاز نگاشت‌شده"
   "Account ID" "شناسه حساب"
   "Date Received" "تاریخ دریافت"
   "Body" "متن"
   "Button Label" "برچسب دکمه"
   "Source" "منبع"
   "Event" "رویداد"
   "Seats" "تعداد مجوزها"
   "Vendor" "فروشنده"
   "Timestamp" "زمان ثبت"
   "Last Name" "نام خانوادگی"
   "First Name" "نام"
   "Trial Converted" "تبدیل دوره آزمایشی"
   "Canceled At" "تاریخ لغو"
   "Trial Ends At" "پایان دوره آزمایشی"
   "Active Subscription" "اشتراک فعال"
   "Plan" "طرح"
   "Price" "قیمت"
   "Legacy Plan" "طرح قدیمی"
   "Name" "نام"
   "Page URL" "نشانی صفحه"
   "Address" "آدرس"
   "Latitude" "عرض جغرافیایی"
   "City" "شهر"
   "Password" "گذرواژه"
   "Country" "کشور"
   "Zip" "کد پستی"
   "Payment" "پرداخت"
   "Reviewer" "بررسی‌کننده"
   "Expected Invoice" "صورت‌حساب مورد انتظار"})

(def content-names
  {"Sample Database" "پایگاه داده نمونه"
   "E-commerce Insights" "بینش‌های تجارت الکترونیک"
   "Overview" "نمای کلی"
   "Portfolio Performance" "عملکرد سبد"
   "Website Analysis" "تحلیل وب‌سایت"
   "Orders + People" "سفارش‌ها و افراد"
   "Revenue by state" "درآمد به تفکیک استان"
   "Customer satisfaction per category" "رضایت مشتری به تفکیک دسته‌بندی"
   "Product category orders per age group" "سفارش‌های دسته محصول به تفکیک گروه سنی"
   "Customer survey responses" "پاسخ‌های نظرسنجی مشتریان"
   "Checkout funnel" "قیف خرید"
   "Product breakdown" "تفکیک محصولات"
   "Total order amount vs. discount given" "مبلغ کل سفارش در مقایسه با تخفیف"
   "Revenue" "درآمد"
   "Orders according to sources per quarter" "سفارش‌ها بر اساس منبع در هر فصل"
   "User flow diagram" "نمودار جریان کاربر"
   "Revenue and orders over time" "روند درآمد و سفارش‌ها"
   "Revenue by product category" "درآمد به تفکیک دسته محصول"
   "Subscription seats over time" "روند تعداد مجوزهای اشتراک"
   "Revenue per quarter" "درآمد هر فصل"
   "Number of subscriptions" "تعداد اشتراک‌ها"
   "Revenue goal for this quarter" "هدف درآمد این فصل"
   "Product category orders per age" "سفارش‌های دسته محصول به تفکیک سن"
   "Number of Orders" "تعداد سفارش‌ها"
   "Total orders by product category" "مجموع سفارش‌ها به تفکیک دسته محصول"
   "Best selling products" "پرفروش‌ترین محصولات"
   "Average product rating" "میانگین امتیاز محصول"
   "Most recent subscription" "جدیدترین اشتراک"
   "Orders by product category" "سفارش‌ها به تفکیک دسته محصول"
   "All subscriptions in table view" "همه اشتراک‌ها در نمای جدولی"
   "Heavy-Duty Silk Chair trend" "روند صندلی ابریشمی سنگین"
   "Quantity sold per quarter" "تعداد فروش در هر فصل"
   "Revenue per age group" "درآمد به تفکیک گروه سنی"
   "Enormous Wool Car trend" "روند خودروی پشمی بزرگ"
   "Unique customers per month" "مشتریان یکتا در هر ماه"
   "Checkout funnel - Modified" "قیف خرید - ویرایش‌شده"
   "People with age" "افراد همراه با سن"
   "Revenue per individual age" "درآمد به تفکیک سن"
   "Discounts given per quarter" "تخفیف‌های ارائه‌شده در هر فصل"
   "Orders by source per individual age" "سفارش‌ها بر اساس منبع و سن"
   "Orders by source per age group" "سفارش‌ها بر اساس منبع و گروه سنی"
   "Aerodynamic Copper Knife trend" "روند چاقوی مسی آیرودینامیک"
   "Order value distribution by category" "توزیع ارزش سفارش به تفکیک دسته‌بندی"
   "Total orders this quarter" "مجموع سفارش‌های این فصل"
   "Examples" "نمونه‌ها"
   "E-commerce" "تجارت الکترونیک"})

(def descriptions
  {"Some example data for you to play around with." "چند داده نمونه برای کاوش و تمرین."
   "Overview of sample data and hypothetical sales" "نمای کلی داده‌های نمونه و فروش فرضی"
   "Sample orders joined with products" "سفارش‌های نمونه متصل‌شده به محصولات"
   "Revenue in the US broken down by state" "درآمد در آمریکا به تفکیک استان"
   "Shows the distribution of the product categories along the scale of customer ratings" "توزیع دسته‌های محصول را بر اساس امتیاز مشتریان نشان می‌دهد"
   "Shows a distribution of orders broken down by product categories across our customers' age groups" "توزیع سفارش‌ها را بر اساس دسته محصول و گروه سنی مشتریان نشان می‌دهد"
   "Feedback on our products via weekly survey" "بازخورد هفتگی مشتریان درباره محصولات"
   "Flow from viewing our website (empty) to checkout and subscribe" "مسیر کاربر از مشاهده وب‌سایت تا خرید و اشتراک"
   "Orders for each product, grouped by product category" "سفارش‌های هر محصول به تفکیک دسته محصول"
   "Analysis of discounts given vs. the size of the order" "تحلیل تخفیف‌های ارائه‌شده در مقایسه با مبلغ سفارش"
   "Canonical metric for revenue across all product lines" "معیار اصلی درآمد در همه خطوط محصول"
   "Orders placed per quarter broken down by source and formatted to highlight best and worst quarters" "سفارش‌های هر فصل به تفکیک منبع، همراه با نمایش بهترین و ضعیف‌ترین فصل‌ها"
   "Sankey flow from visiting our website to taking an action" "نمودار جریان از بازدید وب‌سایت تا انجام یک اقدام"
   "Cumulative revenue overlaid with number of orders placed each month" "درآمد تجمعی همراه با تعداد سفارش‌های ثبت‌شده در هر ماه"
   "Monthly revenue broken down by products" "درآمد ماهانه به تفکیک محصولات"
   "Number of seats in an average subscription, showing increase and decrease" "تعداد مجوزها در یک اشتراک متوسط همراه با روند افزایش و کاهش"
   "Total revenue last quarter compared to the previous" "مقایسه درآمد کل فصل گذشته با فصل پیش از آن"
   "Customers that signed up for our monthly subscription" "مشتریانی که اشتراک ماهانه تهیه کرده‌اند"
   "Compares total revenue this quarter to our goal" "مقایسه درآمد کل این فصل با هدف تعیین‌شده"
   "Canonical metric for number of orders placed" "معیار اصلی تعداد سفارش‌های ثبت‌شده"
   "Breaks down the overall performance of each of the product categories" "عملکرد کلی هر دسته محصول را تفکیک می‌کند"
   "An ordered list of our most successful products" "فهرست رتبه‌بندی‌شده موفق‌ترین محصولات"
   "Indicates the average customer review of our products" "میانگین امتیاز مشتریان به محصولات را نشان می‌دهد"
   "The most recent subscription in our database" "جدیدترین اشتراک موجود در پایگاه داده"
   "Compares the orders of each category quarter over quarter" "مقایسه سفارش‌های هر دسته در فصل‌های متوالی"
   "More complete look at all recent subscriptions" "نمای کامل‌تر همه اشتراک‌های اخیر"
   "Compares the total number of orders placed for this product this month with the previous period" "مقایسه تعداد کل سفارش‌های این محصول در ماه جاری با دوره قبل"
   "Total sum of products sold last quarter compared to the previous" "مقایسه تعداد کل محصولات فروخته‌شده در فصل گذشته با فصل پیش از آن"
   "Shows the revenue distributed by age group" "درآمد را به تفکیک گروه سنی نشان می‌دهد"
   "Unique customer email addresses last quarter compared to the previous" "مقایسه مشتریان یکتای فصل گذشته با فصل پیش از آن"
   "Shows a distribution of revenue per individual age values" "توزیع درآمد را به تفکیک سن نشان می‌دهد"
   "Total amount of discounts last quarter compared to the previous" "مقایسه مجموع تخفیف‌های فصل گذشته با فصل پیش از آن"
   "Shows a distribution of orders broken down by source across our customers' individual age values" "توزیع سفارش‌ها را بر اساس منبع و سن مشتریان نشان می‌دهد"
   "Shows a distribution of orders broken down by source across our customers' age groups" "توزیع سفارش‌ها را بر اساس منبع و گروه سنی مشتریان نشان می‌دهد"
   "Total number of orders in the current quarter." "تعداد کل سفارش‌ها در فصل جاری."
   "Some examples to get started with" "چند نمونه برای شروع"
   "Questions and metrics used for the parent dashboard" "پرسش‌ها و معیارهای استفاده‌شده در داشبورد اصلی"})

(def parameter-names
  {"Date Range" "بازه زمانی"
   "Date Grouping" "گروه‌بندی زمانی"
   "Product Category" "دسته محصول"
   "Vendor" "فروشنده"})

(defn execute-update! [conn sql params]
  (with-open [stmt (.prepareStatement conn sql)]
    (doseq [[index value] (map-indexed vector params)]
      (.setString stmt (inc index) value))
    (.executeUpdate stmt)))

(defn update-exact! [conn table column translations]
  (reduce-kv
   (fn [count old new]
     (+ count
        (execute-update!
         conn
         (format "UPDATE %s SET %s = ? WHERE %s = ?" table column column)
         [new old])))
   0
   translations))

(defn rewrite-column! [conn table column translations]
  (with-open [select-stmt (.createStatement conn)
              rows (.executeQuery select-stmt (format "SELECT id, %s FROM %s WHERE %s IS NOT NULL" column table column))]
    (loop [count 0]
      (if-not (.next rows)
        count
        (let [id (.getLong rows 1)
              stored (.getString rows 2)
              original (if (and (str/starts-with? stored "\"")
                                (str/ends-with? stored "\""))
                         (json/parse-string stored)
                         stored)
              translated (reduce-kv str/replace original translations)]
          (with-open [update-stmt (.prepareStatement conn (format "UPDATE %s SET %s = ? FORMAT JSON WHERE id = ?" table column))]
            (.setString update-stmt 1 translated)
            (.setLong update-stmt 2 id)
            (.executeUpdate update-stmt))
          (recur (inc count)))))))

(defn source-replacements [key translations]
  (into {}
        (map (fn [[old new]]
               [(format ":%s \"%s\"" key old)
                (format ":%s \"%s\"" key new)]))
        translations))

(defn update-source! []
  (let [path "resources/sample-content.edn"
        original (slurp path)
        replacements (merge
                      (source-replacements "name" (merge table-names content-names))
                      (source-replacements "display_name" (merge table-names field-names))
                      (source-replacements "description" descriptions))
        translated (reduce-kv str/replace original replacements)]
    (when-not (= original translated)
      (spit path translated))
    (not= original translated)))

(defn update-database! []
  (with-open [conn (.getConnection app-db/data-source)]
    (.setAutoCommit conn false)
    (try
      (let [counts
            {:databases (+ (update-exact! conn "metabase_database" "name" {"Sample Database" "پایگاه داده نمونه"})
                           (update-exact! conn "metabase_database" "description" descriptions))
             :dashboards (+ (update-exact! conn "report_dashboard" "name" content-names)
                            (update-exact! conn "report_dashboard" "description" descriptions))
             :collections (+ (update-exact! conn "collection" "name" content-names)
                             (update-exact! conn "collection" "description" descriptions))
             :tables (update-exact! conn "metabase_table" "display_name" table-names)
             :fields (update-exact! conn "metabase_field" "display_name" field-names)
             :cards (+ (update-exact! conn "report_card" "name" content-names)
                       (update-exact! conn "report_card" "description" descriptions))
             :card-metadata (rewrite-column! conn "report_card" "result_metadata" field-names)
             :card-settings (rewrite-column! conn "report_card" "visualization_settings" (merge content-names field-names parameter-names))
             :dashboard-parameters (rewrite-column! conn "report_dashboard" "parameters" parameter-names)
             :dashboard-cards (rewrite-column! conn "report_dashboardcard" "visualization_settings" (merge content-names descriptions field-names parameter-names))}]
        (.commit conn)
        counts)
      (catch Throwable error
        (.rollback conn)
        (throw error)))))

(let [source-updated? (update-source!)
      counts (update-database!)]
  (println "Persian sample-content source updated:" source-updated?)
  (println "Database rows updated:" counts))
