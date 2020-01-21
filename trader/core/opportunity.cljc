(ns opportunity
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [timestamp :as timestamp]
            [exchange :as exchange]
            [market :as market]
            [order-book :as order-book]))

(s/def ::buy (s/keys :req-un [::exchange/exchange ::order-book/order-book]))
(s/def ::sell (s/keys :req-un [::exchange/exchange ::order-book/order-book]))

(defn calc-coef [{buy :buy sell :sell}]
  (let [bids (get-in buy [:order-book :bids])
        asks (get-in sell [:order-book :asks])
        highest-bid-price ((first bids) :price)
        lowest-ask-price ((first asks) :price)]
    (/ lowest-ask-price highest-bid-price)))
(defn coef>1? [opportunity] (> (calc-coef opportunity) 1))

(def ten-seconds 10000)
(defn abs [n] (max n (- n)))
(defn calc-timestamp-diff [{buy :buy sell :sell}]
  (let [buy-order-book-timestamp (get-in buy [:order-book :timestamp])
        sell-order-book-timestamp (get-in sell [:order-book :timestamp])]
    (abs (- buy-order-book-timestamp sell-order-book-timestamp))))
(defn ts-diff<10s? [opportunity] (< (calc-timestamp-diff opportunity) ten-seconds))

(def gen-opportunity
  (gen/let [base-price (s/gen ::order-book/price)
            base-timestamp (s/gen ::timestamp/timestamp)
            buy-ts-delta (s/gen ::timestamp/delta-up-to-five-seconds)
            sell-ts-delta (s/gen ::timestamp/delta-up-to-five-seconds)
            buy-order-book (order-book/gen-order-book
                             (int (* base-price 0.99))
                             (+ base-timestamp buy-ts-delta))
            sell-order-book (order-book/gen-order-book
                              (int (* base-price 1.01))
                              (+ base-timestamp sell-ts-delta))
            market (s/gen ::market/market)
            ;TODO buy exchange should have portfolio in quote asset
            buy-exchange (s/gen ::exchange/exchange)
            ;TODO sell exchange should have portfolio in base asset
            sell-exchange (s/gen ::exchange/exchange)]
           {:market market
            :buy    {:exchange buy-exchange :order-book buy-order-book}
            :sell   {:exchange sell-exchange :order-book sell-order-book}}))
(s/def ::opportunity
  (s/with-gen
    (s/and coef>1?
           ts-diff<10s?
           ;TODO there should be enough balance on both exchanges to take advantage of opportunity
           (s/keys :req-un [::market/market ::buy ::sell]))
    (fn [] gen-opportunity)))

(comment
  (gen/sample (s/gen ::opportunity))
  (def test-opportunity (gen/generate gen-opportunity))
  (calc-coef test-opportunity)
  (def test-opportunity2 (gen/generate gen-opportunity))
  (calc-timestamp-dif))
