class CreatePosts < ActiveRecord::Migration[6.1]
  def change
    create_table :posts do |t|
      t.string :name
      t.string :address
      t.text :description
      t.time :business_hours_start
      t.time :business_hours_end
      t.integer :fee
      t.string :stay_time
      t.boolean :eat_walk
      t.timestamps
    end
  end
end
