(ns pair-trader.pair-trader
  (:require [clojure.test :refer :all]
            [auxon.clj-cucumber :refer [run-cucumber]]
            [auxon.clj-cucumber.generative :as cgen :refer (generator property step)]
            [clojure.test.check.generators :as gen]
            [clojure.alpha.spec :as s]

            [hodur-engine.core :as hodur]
            [hodur-spec-schema.core :as hodur-spec]))

(def gen-non-blank-string (gen/not-empty gen/string-alphanumeric))

(s/def ::non-blank-string
  (s/with-gen
    (s/and string? (fn [s] (not (clojure.string/blank? s))))
    (fn [] gen-non-blank-string)))

(def asset-regex #"^[A-Z]{3,5}$")

(defn valid-asset?
  [e]
  (re-matches asset-regex e))

(def gen-asset (gen/fmap (fn [v] (->> (clojure.string/join v)
                                       (clojure.string/upper-case)))
                          (gen/vector gen/char-alpha 3 5)))

(s/def ::asset (s/with-gen (s/and string? valid-asset?)
                           (fn [] gen-asset)))



(def symbol-regex #"^[A-Z]{3,5}/[A-Z]{3,5}$")

(defn valid-symbol?
  [e]
  (re-matches symbol-regex e))

(def gen-symbol (gen/fmap (fn [[asset1 asset2]] (str asset1 "/" asset2))
                          (gen/tuple gen-asset gen-asset)))


(s/def ::symbol (s/with-gen (s/and string? valid-symbol?) (fn [] gen-symbol)))
(s/def ::asset-pair (s/coll-of ::asset :count 2 :distinct true :kind vector?))
(s/def ::portfolio-item (s/schema {:balance pos-int? :asset ::asset}))
(s/def ::portfolio (s/coll-of (s/select ::portfolio-item [*]) :min-count 1))
(s/def ::exchange (s/schema {:id ::non-blank-string :portfolio ::portfolio}))
(s/def ::exchange-pair (s/coll-of (s/select ::exchange [*]) :count 2 :distinct true))

(def price-regex #"^\d+\.\d+$")

(defn valid-price?
  [e]
  (re-matches price-regex e))

(def gen-price (gen/fmap (fn [[integer fraction]] (str integer "." fraction))
                          (gen/tuple gen/nat gen/nat)))


(s/def ::cost (s/with-gen (s/and string? valid-price?) (fn [] gen-price)))
(s/def ::side #{:buy :sell})
(s/def ::order-command (s/schema {:side ::side :exchange-id ::non-blank-string :symbol ::symbol :amount nat-int? :price ::price}))

(defn valid-opportunity? [commands]
  (->> commands
       (map (fn [{side :side amount :amount}] (case side
                                                :buy (- amount)
                                                :sell amount)))
       (reduce +)
       (> 0)))
(s/def ::opportunity (s/and valid-opportunity? (s/coll-of (s/select ::order-command [*]) :count 2 :distinct true :kind vector?)))


(comment
  (def opportunity (gen/generate (s/gen ::opportunity)))
  (valid-opportunity? opportunity)
  (gen/generate (s/gen ::order-command))
  ())

(defn open-trade [exchanges opportunity])

(def cleanup-called (atom false))

(def steps
  [cgen/before-hook

   (generator :Given "^an asset pair$"
              (fn an-asset-pair [state]
                [:asset-pair (s/gen ::asset-pair)]))

   (generator :Given "^an exchange pair$"
              (fn an-exchange-pair [state]
                [:exchanges (s/gen ::exchange-pair)]))

   (step :Given "^one exchange has positive balance in first asset$"
              (fn positive-balance-in-first-asset [state]
                (assoc state :exchanges (->
                                          (get state :exchanges)
                                          (assoc-in [0 ::portfolio 0 ::symbol]
                                                    (get-in state [:asset-pair 0]))))))

   (step :Given "^the other exchange has positive balance in second asset$"
              (fn positive-balance-in-second-asset [state]
                (assoc state :exchanges (->
                                          (get state :exchanges)
                                          (assoc-in [1 ::portfolio 0 ::symbol]
                                                    (get-in state [:asset-pair 1]))))))

   (step :When "^an opportunity happens$"
         (fn an-opportunity-occurs [state]
           (assoc state :open-trade-res (open-trade (state :exchanges) ()))))

   (property #"^a buy order is placed on one exchange$"
             (fn buy-order-is-placed [env]
               (contains? env :asset-pair)))

   ;(generator :Given "^positive balance (.) on exchange (.) in asset (.)$"
   ;           (fn pos-balance-on-one-exchange [state balance name asset]
   ;             (assoc state :exchange {:name name :portfolio {:asset asset :balance balance}} )))
   ;
   ;(generator :Given "^positive balance (.) on exchange (.) in asset (.)$"
   ;           (fn pos-balance-on-one-exchange [state balance name asset]
   ;             (assoc state :exchange {:name name :portfolio {:asset asset :balance balance}} )))
   (cgen/after-hook-with-cleanup
     (fn cleanup [state]
       (do
         (clojure.pprint/pprint state)
         (reset! cleanup-called true))))
   ])


(deftest pair-trader-feature
  (is (= 0 (run-cucumber "test/pair_trader/pair-trader.feature" steps)))
  (is @cleanup-called))
