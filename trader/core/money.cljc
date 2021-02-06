(ns money
  (:require #?(:clj  [clojure.spec.alpha :as s]
               :cljs [cljs.spec.alpha :as s])
            [clojure.test.check.generators :as gen]
            [math :as math]
            [big-dec :as big-dec]
            [asset :as asset]))

(defn gen-amount [precision]
  (let [precision-multiplier (math/pow 10 precision)]
    (gen/fmap
      (fn [int-amount] (-> (big-dec/big-dec int-amount)
                            (big-dec/div precision-multiplier)))
      (gen/large-integer* {:min precision-multiplier}))))

(def default-precision 2)
; TODO current limitation with amount is that it generates values >= 1 always,
; for BTC for instance it does not make much sense
(s/def ::amount
  (s/with-gen big-dec/big-dec?
              (fn [] (gen-amount default-precision))))

(defn gen-money [asset]
  (gen/let [amount (->> (asset :precision)
                        (math/pow 10)
                        (gen-amount))]
           {:asset asset :amount amount}))
(s/def ::money
  (s/with-gen
    (s/keys :req-un [::asset/asset ::amount])
    (fn [] (gen-money (gen/generate (s/gen ::asset/asset))))))


(comment
  (gen/sample (s/gen ::amount))
  (gen/generate (gen/fmap
                  (fn [int-amount] (-> (big-dec/big-dec int-amount)
                                        (big-dec/div 100)))
                  (gen/large-integer* {:min 100})))
  (s/conform ::amount 1231.0)
  (def test-asset (gen/generate (s/gen ::asset/asset)))
  (gen-money asset)
  (gen/sample (s/gen ::money)))
