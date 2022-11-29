class CreateReviews < ActiveRecord::Migration[6.1]
  def change
    create_table :reviews do |t|
      t.string :title
      t.string :comment
      t.float :rate

      t.timestamps
    end
  end
end
